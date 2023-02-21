import { existsSync, readFileSync } from 'fs';
import XRegExp from 'xregexp';
import { debug } from './logger';
import { dirname, join, relative, resolve } from './path';
import { PluginConfig } from './types';

export const getIndexHtml = (index: PluginConfig['build']['index'], pathOnly = false) => {
    let indexPath = require.resolve('../index.html');
    if (index && existsSync(index as string)) {
        indexPath = resolve(process.cwd(), index as string);
    }
    if (pathOnly) {
        return indexPath;
    }
    const indexFile = readFileSync(indexPath, 'utf-8');
    return indexFile;
};

export const getResources = (root: string, code: string, fileName: string, regex: RegExp) => {
    const matches = code.match(regex)?.[1] || '';
    if (matches) {
        const prefix = 'ng_resource';
        return matches
            .trim()
            .split(/['`", ]/g)
            .filter(Boolean)
            .map(resource => {
                resource = resource.trim();
                const resourcePath = join(dirname(fileName), resource);
                const content = encodeURIComponent(readFileSync(resourcePath, 'utf-8'));
                const path = relative(root, resourcePath);
                const name = prefix + '_' + path.match(/([^\\\/]+)+$/)?.[0].replace(/[\.\/\\-]/g, '_');

                debug('root:', root);
                debug('resourceName:', name);
                debug('resourcePath:', path);

                return { name, path, content };
            });
    }
    return [];
};

export const analyzeConstructor = code => {
    let _ctor, _deps, _super, start, end;
    let newConstructor, oldConstructor;
    start = code.indexOf('constructor');
    if (start > -1) {
        const depsStart = code.indexOf('(', start);
        const depsEnd = code.indexOf('{', start);
        _deps = code
            .replace(/[\r|\t|\n]/g, ' ')
            .substring(depsStart, depsEnd)
            .trim()
            .replace(/^\((.*)\)$/, '$1')
            .trim()
            .split(/\,\s*/g)
            .filter(Boolean);

        _ctor = XRegExp.matchRecursive(code.substring(depsEnd), '{', '}')[0];
        end = depsEnd + _ctor.length + 2;

        const superStart = _ctor.indexOf('super');
        if (superStart > -1) {
            _super = XRegExp.matchRecursive(_ctor.substring(superStart), '\\(', '\\)')[0];
        }
        const { constDeps, thisDeps } = extractDeps(_deps, _super);
        if (constDeps.length || thisDeps.length) {
            newConstructor = [
                //
                'constructor() {',
                ...constDeps,
                _ctor.includes('super(') ? `super(${_super});` : '',
                ...thisDeps,
                ..._ctor.replace(/super.*\(.*\);*/, '').split('\n'),
                '}',
            ]
                .map(x => x.trim())
                .filter(Boolean)
                .join('\n');
        }
    }
    if (start && end) {
        oldConstructor = code.substring(start, end);
    }
    return { newConstructor, oldConstructor };
};

export const extractDeps = (_deps, _super) => {
    const depsRegex =
        /(?:\s|\n|\r|\t)*(@Inject.*\((?<inject>.*)\))?((?:\s|\n|\r|\t)*(?<visibility>(?:private|public|protected|readonly|static)*)?(?:\s|\n|\r|\t)*(?<variable>.*)(?:\s|\n|\r|\t)*(?:\:(?:\s|\n|\r|\t)*((?<type>[^\<]*))))/;

    const depsMap = _deps
        .map(dep => {
            const match = dep.match(depsRegex);
            if (match?.groups) {
                const { visibility, variable, inject, type } = match.groups;
                const prefix = (_super && _super.includes(variable)) || !visibility ? 'const ' : 'this.';
                return `${prefix}${variable} = inject(${inject || type});`;
            }
        })
        .filter(Boolean);

    const constDeps = depsMap.filter(dep => dep.startsWith('const'));
    const thisDeps = depsMap.filter(dep => dep.startsWith('this'));
    return { constDeps, thisDeps };
};
