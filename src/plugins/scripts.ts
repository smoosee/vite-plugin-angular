import { JSDOM } from 'jsdom';
import { resolve } from '../path';
import { Plugin } from 'vite';
import { PluginConfig } from '../types';

export default ({ build: { scripts } }: PluginConfig) => {
    return {
        name: 'vite:ng-scripts',
        transformIndexHtml(html) {
            const dom = new JSDOM(html);
            const document = dom.window.document;

            (scripts || []).forEach((script: string) => {
                const element = document.createElement('script');
                element.src = `@fs/${resolve(process.cwd(), script)}`;

                document.body.appendChild(element);
            });
            return document.documentElement.outerHTML;
        },
    } as Plugin;
};
