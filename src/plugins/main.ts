import { resolve } from '../path';
import { Plugin } from 'vite';
import { PluginConfig } from '../types';

export default ({ build: { main } }: PluginConfig) => {
    return {
        name: 'vite:ng-main',
        transform(code, fileName, options) {
            const mainPath = resolve(process.cwd(), main);
            if (fileName === mainPath) {
                code = [
                    //
                    `import "@angular/compiler";`,
                    `import "zone.js";`,
                    code,
                ].join('\n');
                return { code };
            }
        },
    } as Plugin;
};
