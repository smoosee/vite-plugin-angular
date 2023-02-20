import swc from 'rollup-plugin-swc';
import requireTransform from 'vite-plugin-require-transform';
import tsconfigPaths from 'vite-tsconfig-paths';
import { splitVendorChunkPlugin } from 'vite';
import VitePluginSass from '@smoosee/vite-plugin-sass';

export default [
    VitePluginSass(),
    splitVendorChunkPlugin(),
    swc({
        rollup: {
            include: '**/*.ts',
            exclude: '**/*.@(sass|scss)',
        },
        jsc: {
            parser: {
                syntax: 'typescript',
                dynamicImport: true,
                decorators: true,
            },
            target: 'es2022',
            transform: {
                decoratorMetadata: true,
            },
        },
    }),
    // @ts-expect-error
    requireTransform({}),
    tsconfigPaths(),
];
