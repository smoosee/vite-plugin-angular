import { PluginConfig } from '../types';
import { getIndexHtml } from '../utils';
import { mergeConfig, Plugin, UserConfig } from 'vite';

export default ({ selectors, flags, project, build, serve }: PluginConfig) => {
    return {
        name: 'vite:ng-config',
        config(config: UserConfig, env) {
            return mergeConfig(config, {
                esbuild: !flags.enableSWC,
                base: build.baseHref || serve.servePath || '',
                root: project.root,
                server: {
                    port: serve.port,
                    open: flags.autoOpen,
                },
                resolve: {
                    alias: [...(selectors.resolveDeps || []).map(dep => ({ find: dep, replacement: dep }))],
                },
                build: {
                    rollupOptions: {
                        input: {
                            main: getIndexHtml(build.index, true),
                        },
                    },
                },
                optimizeDeps: {
                    extensions: ['scss', 'sass', 'css'],
                    include: [...(selectors.optimizeDeps || [])],
                },
            } as UserConfig);
        },
    } as Plugin;
};
