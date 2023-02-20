import { JSDOM } from 'jsdom';
import { resolve } from '../path';
import { Plugin } from 'vite';
import { PluginConfig } from '../types';

export default ({ build: { main }, flags: { injectMain } }: PluginConfig) => {
    return {
        name: 'vite:ng-index',
        enforce: 'pre',
        transformIndexHtml(html) {
            if (main && injectMain) {
                const dom = new JSDOM(html);
                const document = dom.window.document;

                const script = document.createElement('script');
                script.type = 'module';
                script.src = '@fs/' + resolve(process.cwd(), main);

                document.body.appendChild(script);
                return document.documentElement.outerHTML;
            }
            return html;
        },
    } as Plugin;
};
