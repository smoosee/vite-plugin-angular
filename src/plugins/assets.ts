import { existsSync, readFileSync } from 'fs';
import { Plugin, ViteDevServer } from 'vite';
import { resolve, slash } from '../path';
import { PluginConfig } from '../types';
import mimeTypes from 'mime-types';

export default ({ build: { assets } }: PluginConfig) => {
    return {
        name: 'vite:ng-assets',
        configureServer(server: ViteDevServer) {
            const assetsMappings = assets.map(asset => {
                if (typeof asset === 'string') {
                    return { input: asset, output: `/${asset.split('/').pop()}` };
                } else {
                    asset.input = slash(asset.input + '/');
                    asset.output = slash('/' + asset.output + '/');
                    return asset;
                }
            });
            return () => {
                server.middlewares.use('/', async (req, res, next) => {
                    const { url } = req;
                    const assetMap = assetsMappings.find(assetMap => url.startsWith(assetMap.output));
                    if (assetMap) {
                        const filePath = resolve(process.cwd(), url.replace(assetMap.output, assetMap.input));
                        if (existsSync(filePath)) {
                            res.writeHead(200, { 'Content-Type': mimeTypes.lookup(url) });
                            res.write(readFileSync(filePath));
                        }
                    }
                    return next();
                });
            };
        },
    } as Plugin;
};
