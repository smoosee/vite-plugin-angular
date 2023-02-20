import { mergeConfig, Plugin, UserConfig } from 'vite';
import { resolve } from '../path';
import { PluginConfig } from '../types';

export default ({ build: { main, styles, stylePreprocessorOptions } }: PluginConfig) => {
    return {
        name: 'vite:ng-styles',
        config(config, env) {
            return mergeConfig(config, {
                css: {
                    devSourcemap: true,
                    preprocessorOptions: {
                        scss: {
                            includePaths: stylePreprocessorOptions?.includePaths || [],
                        },
                    },
                },
            } as UserConfig);
        },
        transform(code, fileName, options) {
            const mainPath = resolve(process.cwd(), main).replace(/[\\|\/]/g, '/');
            if (fileName === mainPath) {
                code = (styles || []) //
                    .map(style => resolve(process.cwd(), style as string))
                    .map(path => path.replace(/\\/g, '/'))
                    .map(path => `import "${path}";`)
                    .concat([code])
                    .join('\n');
                return { code };
            }
        },
    } as Plugin;
};
