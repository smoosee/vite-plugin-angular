import { getIndexHtml } from '../utils';
import { Plugin, ViteDevServer } from 'vite';
import { PluginConfig } from '../types';

export default ({ build: { index } }: PluginConfig) => {
    return {
        name: 'vite:ng-server',
        configureServer(server: ViteDevServer) {
            return () => {
                server.middlewares.use('/', async (req, res, next) => {
                    const { url } = req;
                    if (url === '/' || url === '/index.html') {
                        const html = await server.transformIndexHtml(url, getIndexHtml(index as string));
                        res.end(html);
                    }
                    return next();
                });
            };
        },
    } as Plugin;
};
