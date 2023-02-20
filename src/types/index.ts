import { DevServerTarget as ServeOptions, Project as AngularProject, WebpackBrowserSchemaForBuildFacade as BuildOptions } from './angular';

export type { AngularProject, BuildOptions, ServeOptions };

export enum LogLevel {
    verbose,
    info,
    warn,
    error,
}

export const LogLevels = {
    [LogLevel.verbose]: {
        alias: 'debug',
        color: 'magenta',
    },
    [LogLevel.info]: {
        alias: 'log',
        color: 'green',
    },
    [LogLevel.warn]: {
        alias: 'warn',
        color: 'orange',
    },
    [LogLevel.error]: {
        alias: 'error',
        color: 'red',
    },
};

export type PluginConfig = {
    selectors?: {
        jsonPath?: string;
        selectedProject?: string;
        optimizeDeps?: string[];
        resolveDeps?: string[];
        logLevel?: LogLevel;
    };
    flags?: {
        autoOpen?: boolean;
        enableSWC?: boolean;
        injectMain?: boolean;
        inlineResources?: boolean;
    };
    project?: AngularProject;
    build?: BuildOptions;
    serve?: ServeOptions;
};
