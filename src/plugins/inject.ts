import { PluginConfig } from '../types';
import { analyzeConstructor } from '../utils';
import { Plugin } from 'vite';

export default (pluginConfig: PluginConfig) => {
    return {
        name: 'vite:ng-inject',
        enforce: 'pre',
        transform(code, fileName, options) {
            if (/\.(ts|tsx)$/.test(fileName)) {
                const { newConstructor, oldConstructor } = analyzeConstructor(code);
                if (newConstructor) {
                    code = `import { inject } from "@angular/core";\n${code.replace(oldConstructor, newConstructor)}`;
                }
                return { code };
            }
        },
    } as Plugin;
};
