import { Plugin } from 'vite';
import { debug } from '../logger';
import { PluginConfig } from '../types';
import { getResources } from '../utils';

export default ({ flags: { inlineResources }, project: { root } }: PluginConfig) => {
    return {
        name: 'vite:ng-resources',
        transform(code, fileName, options) {
            let imports = [];
            if (/\.(ts|tsx)$/.test(fileName)) {
                debug('fileName:', fileName);
                const templateUrlRegex = /templateUrl.*['`"](.*)['`"]/;
                const template = getResources(root, code, fileName, templateUrlRegex)[0];
                if (template) {
                    debug('template:', template);
                    if (inlineResources) {
                        code = code.replace(templateUrlRegex, 'template: `\n' + template.content + '\n`');
                    } else {
                        imports.push(template);
                        code = code.replace(templateUrlRegex, `template: ${template.name}`);
                    }
                }

                const styleUrlsRegex = /styleUrls.*\[\n*((?:.*?|\n*)*?)\]/;
                const styles = getResources(root, code, fileName, styleUrlsRegex);
                if (styles.length) {
                    debug('styles:', styles);
                    if (inlineResources) {
                        code = code.replace(styleUrlsRegex, 'styles: [' + styles.map(style => '`\n' + style.content + '\n`') + ']');
                    } else {
                        imports.push(...styles);
                        code = code.replace(styleUrlsRegex, `styles: [${styles.map(style => style.name)}]`);
                    }
                }

                if (imports.length) {
                    const importStatements = imports
                        .map(item => {
                            const suffix = item.path.endsWith('.html') ? 'raw' : 'inline';
                            return `import ${item.name} from "/${item.path}?${suffix}";`;
                        })
                        .join('\n');
                    code = `${importStatements}\n\n${code}`;
                }

                return { fileName, code: decodeURIComponent(code) };
            }
        },
    } as Plugin;
};
