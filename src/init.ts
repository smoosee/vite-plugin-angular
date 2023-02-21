import { Schema as AngularSchema } from '@angular/cli/lib/config/workspace-schema';
import { setLogLevel } from './logger';
import { resolve } from './path';
import { AngularProject, BuildOptions, PluginConfig, ServeOptions } from './types';

const defaultConfig: PluginConfig = {
    selectors: {
        jsonPath: 'angular.json',
        logLevel: 1,
        optimizeDeps: [
            //
            '@angular/compiler',
            '@angular/material',
            '@angular/cdk',
            'lodash-es',
            'dayjs',
            'zone.js',
        ],
        resolveDeps: [
            //
            '@angular',
            'dayjs',
        ],
    },
    flags: {
        autoOpen: false,
        enableSWC: false,
        injectMain: true,
        inlineResources: true,
    },
};

export const initalizePlugin = (config: PluginConfig) => {
    config.selectors = { ...defaultConfig.selectors, ...config.selectors };
    config.flags = { ...defaultConfig.flags, ...config.flags };
    config.project = getAngularProject(config);
    config.build = getAngularOptions(config);
    config.serve = getAngularOptions(config, 'serve');

    setLogLevel(config.selectors.logLevel);
};

export const getAngularProject = ({ selectors: { jsonPath, selectedProject }, project }: PluginConfig): AngularProject => {
    const configFile = resolve(process.cwd(), jsonPath);
    const angularJson: AngularSchema = require(configFile);
    const projects = angularJson.projects;

    if (!selectedProject) {
        selectedProject = angularJson.defaultProject || Object.keys(projects)[0];
    }
    return { ...projects[selectedProject], ...project } as AngularProject;
};

export const getAngularOptions = ({ selectors, project, build, serve }: PluginConfig, type = 'build'): BuildOptions & ServeOptions => {
    project = getAngularProject({ project, selectors });
    const options = project?.architect?.[type]?.options || {};
    return { ...options, ...(type === 'build' ? build : serve) };
};
