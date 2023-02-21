import { Plugin } from 'vite';
import { PluginConfig } from './types';
import { initalizePlugin } from './init';

import assetsPlugin from './plugins/assets';
import configPlugin from './plugins/config';
import indexPlugin from './plugins/index';
import injectPlugin from './plugins/inject';
import mainPlugin from './plugins/main';
import proxyPlugin from './plugins/proxy';
import resourcesPlugin from './plugins/resources';
import scriptsPlugin from './plugins/scripts';
import serverPlugin from './plugins/server';
import stylesPlugin from './plugins/styles';

import presets from './plugins/presets';

export const VitePluginAngular = (config: PluginConfig = {}): Plugin[] => {
    initalizePlugin(config);


    return [
        ...presets,

        configPlugin(config),

        assetsPlugin(config),
        scriptsPlugin(config),
        stylesPlugin(config),

        indexPlugin(config),
        mainPlugin(config),

        injectPlugin(config),
        resourcesPlugin(config),

        proxyPlugin(config),
        serverPlugin(config),
    ];
};
