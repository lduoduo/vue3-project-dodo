import path from 'path';
// import { RunningScriptOptions } from 'vm'
import { createCompile } from './compile.mjs';
import { createRequire } from './require.mjs';
// import { Files } from './bundle.mjs'

const _global = {
  Buffer,
  URL,
  console,
  process,
  setTimeout,
  setInterval,
  setImmediate,
  clearTimeout,
  clearInterval,
  clearImmediate
};

// export interface CreateEvaluateOptions {
//   basedir?: string,
//   runInNewContext?: 'once' | boolean,
//   runningScriptOptions?: RunningScriptOptions
// }

// export type EvaluateModule = (filename: string, context: Object) => any

// type Sandbox = typeof _global
// type GetSandbox = (context?: object) => Sandbox

function createGetSandbox(once) {
  let _initialContext;

  return function getSandbox(context = {}) {
    if (!once) {
      return { ..._global, ...context };
    }
    return _initialContext || (_initialContext = { ..._global, ...context });
  };
}

function createModule(options) {
  return {
    require: options.require || require,
    id: options.id || 'default',
    filename: options.filename || 'default',
    parent: options.parent || null,
    paths: options.paths || [],
    exports: options.exports || {},
    loaded: options.loaded !== undefined ? options.loaded : false,
    children: options.children || []
  };
}

export function createEvaluateModule(
  files,
  { basedir, runInNewContext, runningScriptOptions }
) {
  const _evalCache = {};

  const compile = createCompile();
  const require = createRequire(
    basedir || process.cwd(),
    files,
    evaluateModule
  );

  const getSandbox = runInNewContext
    ? createGetSandbox(runInNewContext === 'once')
    : null;

  function evaluateModule(filename, context) {
    if (_evalCache[filename]) {
      return _evalCache[filename];
    }

    console.log('evaluateModule filename', filename, context);

    const code = files[filename];
    const script = compile(filename, code);
    const compiledWrapper = getSandbox
      ? script.runInNewContext(getSandbox(context), runningScriptOptions)
      : script.runInThisContext(runningScriptOptions);

    const module = createModule({ filename, id: filename, require });
    compiledWrapper.call(
      module,
      module.exports,
      require,
      module,
      filename,
      path.dirname(filename)
    );

    const res = Object.prototype.hasOwnProperty.call(module.exports, 'default')
      ? module.exports.default
      : module.exports;

    _evalCache[filename] = res;

    console.log('执行module', module.id);

    return res;
  }

  return evaluateModule;
}
