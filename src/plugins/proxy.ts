import { createProxyMiddleware } from 'http-proxy-middleware';
import { Connect, Plugin, ViteDevServer } from 'vite';
import { resolve } from '../path';
import { PluginConfig } from '../types';
import { getPluginIdentifier, debug } from '../logger';

export default ({ serve: { proxyConfig } }: PluginConfig) => {
    return {
        name: getPluginIdentifier(),
        configureServer(server: ViteDevServer) {
            if (proxyConfig) {
                const proxies = require(resolve(process.cwd(), proxyConfig));
                debug('proxyConfig:', resolve(process.cwd(), proxyConfig));
                debug('proxies:', proxies);
                Object.keys(proxies).forEach(domain => {
                    const target = proxies[domain];
                    const proxy = typeof target === 'string' ? { target } : target;
                    const middleware = createProxyMiddleware(proxy) as Connect.NextHandleFunction;
                    server.middlewares.use(domain, middleware);
                });
            }
        },
    } as Plugin;
};
