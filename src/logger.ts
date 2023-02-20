import chalk from 'chalk';
import { basename } from 'path';
import { resolve } from './path';
import { LogLevel, LogLevels } from './types';

let logLevel = 0;
export const setLogLevel = level => {
    logLevel = level;
};

export const getPluginIdentifier = (forLog = false) => {
    const stack = new Error().stack.split('\n');
    const caller = stack[forLog ? 3 : 2].match(/\((.*):\d*:\d*\)/)?.[1];
    if (caller) {
        const included = resolve(caller).match(resolve(__dirname, '..'));
        if (included) {
            const fileName = basename(caller).match(/(.+?)(\.[^.]*$|$)/)?.[1];
            return `vite:ng-${fileName}`;
        }
    }
};

const loggerMethod = level => {
    const { alias, color } = LogLevels[level];
    return (...args) => {
        if (level >= logLevel) {
            const identifier = getPluginIdentifier(true);
            console.log(chalk[color](`[${alias}]`), `[${identifier}]`, ...args);
        }
    };
};

export const debug = loggerMethod(LogLevel.verbose);
export const log = loggerMethod(LogLevel.info);
export const warn = loggerMethod(LogLevel.warn);
export const error = loggerMethod(LogLevel.error);
