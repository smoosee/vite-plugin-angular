import path from 'path';
import { normalizePath } from 'vite';

const slash = (str: string) => {
    return normalizePath(str);
};

const normalizedMethod = methodName => {
    const method = path[methodName];
    return (...args) => slash(method(...args));
};

const dirname = normalizedMethod('dirname');
const join = normalizedMethod('join');
const relative = normalizedMethod('relative');
const resolve = normalizedMethod('resolve');

export { dirname, join, relative, resolve, slash };
