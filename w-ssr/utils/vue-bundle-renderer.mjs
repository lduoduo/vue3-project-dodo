// Source: https://github.com/nuxt/vue-bundle-renderer

import { PassThrough } from 'stream';
import bundleRunner from './bundle-runner/index.mjs';

function rewriteErrorTrace(e, mapConsumers) {
  if (e && typeof e.stack === 'string') {
    e.stack = e.stack
      .split('\n')
      .map(function(line) {
        return rewriteTraceLine(line, mapConsumers);
      })
      .join('\n');
  }
}

function createMapper(clientManifest) {
  const map = createMap(clientManifest);
  return function mapper(moduleIds) {
    const res = new Set();
    for (let i = 0; i < moduleIds.length; i++) {
      const mapped = map.get(moduleIds[i]);
      if (mapped) {
        for (let j = 0; j < mapped.length; j++) {
          res.add(mapped[j]);
        }
      }
    }
    return Array.from(res);
  };
}

function createMap(clientManifest) {
  const map = new Map();
  Object.keys(clientManifest.modules).forEach(id => {
    map.set(id, mapIdToFile(id, clientManifest));
  });
  return map;
}

function mapIdToFile(id, clientManifest) {
  const files = [];
  const fileIndices = clientManifest.modules[id];
  if (fileIndices) {
    fileIndices.forEach(index => {
      const file = clientManifest.all[index];
      if (
        clientManifest.async.includes(file) ||
        !/\.(js|css)($|\?)/.test(file)
      ) {
        files.push(file);
      }
    });
  }
  return files;
}

function isJS(file) {
  return /\.js(\?[^.]+)?$/.test(file);
}

function isCSS(file) {
  return /\.css(\?[^.]+)?$/.test(file);
}

function normalizeFile(file) {
  const withoutQuery = file.replace(/\?.*/, '');
  const extension = withoutQuery.split('.').pop() || '';
  return {
    file,
    extension,
    fileWithoutQuery: withoutQuery,
    asType: getPreloadType(extension)
  };
}

function ensureTrailingSlash(path) {
  if (path === '') {
    return path;
  }
  return path.replace(/([^/])$/, '$1/');
}

function getPreloadType(ext) {
  if (ext === 'js') {
    return 'script';
  } else if (ext === 'css') {
    return 'style';
  } else if (/jpe?g|png|svg|gif|webp|ico/.test(ext)) {
    return 'image';
  } else if (/woff2?|ttf|otf|eot/.test(ext)) {
    return 'font';
  } else {
    return '';
  }
}

function createRenderContext({ clientManifest, publicPath, basedir }) {
  const renderContext = {
    clientManifest,
    publicPath,
    basedir
  };
  if (renderContext.clientManifest) {
    renderContext.publicPath =
      renderContext.publicPath || renderContext.clientManifest.publicPath;
    renderContext.preloadFiles = (
      renderContext.clientManifest.initial || []
    ).map(normalizeFile);
    renderContext.prefetchFiles = (
      renderContext.clientManifest.async || []
    ).map(normalizeFile);
    renderContext.mapFiles = createMapper(renderContext.clientManifest);
  }
  renderContext.publicPath = ensureTrailingSlash(
    renderContext.publicPath || '/'
  );
  return renderContext;
}

function renderStyles(ssrContext, renderContext) {
  const initial = renderContext.preloadFiles || [];
  const async = getUsedAsyncFiles(ssrContext, renderContext) || [];
  const cssFiles = initial.concat(async).filter(({ file }) => isCSS(file));
  return cssFiles
    .map(({ file }) => {
      return `<link rel="stylesheet" href="${renderContext.publicPath}${file}">`;
    })
    .join('');
}

function renderResourceHints(ssrContext, renderContext) {
  return (
    renderPreloadLinks(ssrContext, renderContext) +
    renderPrefetchLinks(ssrContext, renderContext)
  );
}

function renderPreloadLinks(ssrContext, renderContext) {
  const files = getPreloadFiles(ssrContext, renderContext);
  const shouldPreload = renderContext.shouldPreload;
  if (files.length) {
    return files
      .map(({ file, extension, fileWithoutQuery, asType }) => {
        let extra = '';
        if (!shouldPreload && asType !== 'script' && asType !== 'style') {
          return '';
        }
        if (shouldPreload && !shouldPreload(fileWithoutQuery, asType)) {
          return '';
        }
        if (asType === 'font') {
          extra = ` type="font/${extension}" crossorigin`;
        }
        return `<link rel="preload" href="${renderContext.publicPath}${file}"${
          asType !== '' ? ` as="${asType}"` : ''
        }${extra}>`;
      })
      .join('');
  } else {
    return '';
  }
}

function renderPrefetchLinks(ssrContext, renderContext) {
  const shouldPrefetch = renderContext.shouldPrefetch;
  if (renderContext.prefetchFiles) {
    const usedAsyncFiles = getUsedAsyncFiles(ssrContext, renderContext);
    const alreadyRendered = file => {
      return usedAsyncFiles && usedAsyncFiles.some(f => f.file === file);
    };
    return renderContext.prefetchFiles
      .map(({ file, fileWithoutQuery, asType }) => {
        if (shouldPrefetch && !shouldPrefetch(fileWithoutQuery, asType)) {
          return '';
        }
        if (alreadyRendered(file)) {
          return '';
        }
        return `<link rel="prefetch" href="${renderContext.publicPath}${file}">`;
      })
      .join('');
  } else {
    return '';
  }
}

function renderScripts(ssrContext, renderContext) {
  if (renderContext.clientManifest && renderContext.preloadFiles) {
    const initial = renderContext.preloadFiles.filter(({ file }) => isJS(file));
    const async = (
      getUsedAsyncFiles(ssrContext, renderContext) || []
    ).filter(({ file }) => isJS(file));
    const needed = [initial[0]].concat(async, initial.slice(1));
    return needed
      .map(({ file }) => {
        return `<script src="${renderContext.publicPath}${file}" defer></script>`;
      })
      .join('');
  } else {
    return '';
  }
}
function getPreloadFiles(ssrContext, renderContext) {
  const usedAsyncFiles = getUsedAsyncFiles(ssrContext, renderContext);
  if (renderContext.preloadFiles || usedAsyncFiles) {
    return (renderContext.preloadFiles || []).concat(usedAsyncFiles || []);
  } else {
    return [];
  }
}
function getUsedAsyncFiles(ssrContext, renderContext) {
  if (
    !ssrContext._mappedFiles &&
    ssrContext._registeredComponents &&
    renderContext.mapFiles
  ) {
    const registered = Array.from(ssrContext._registeredComponents);
    ssrContext._mappedFiles = renderContext
      .mapFiles(registered)
      .map(normalizeFile);
  }
  return ssrContext._mappedFiles || [];
}

function createRenderer1(createApp, renderOptions) {
  const renderContext = createRenderContext(renderOptions);
  return {
    async renderToString(ssrContext) {
      ssrContext._registeredComponents =
        ssrContext._registeredComponents || new Set();
      const app = await createApp(ssrContext);
      const html = await renderOptions.renderToString(app, ssrContext);
      const wrap = fn => () => fn(ssrContext, renderContext);
      return {
        html,
        renderResourceHints: wrap(renderResourceHints),
        renderStyles: wrap(renderStyles),
        renderScripts: wrap(renderScripts)
      };
    }
  };
}

export function createRenderer(createApp, renderOptions) {
  const renderContext = createRenderContext(renderOptions);
  const { vueServerRenderer } = renderOptions;

  function renderResources(ssrContext) {
    const wrap = fn => () => fn(ssrContext, renderContext);

    return {
      renderResourceHints: wrap(renderResourceHints),
      renderStyles: wrap(renderStyles),
      renderScripts: wrap(renderScripts)
    };
  }

  async function renderToString(ssrContext) {
    ssrContext._registeredComponents =
      ssrContext._registeredComponents || new Set();

    const app = await createApp(ssrContext);

    const html = await vueServerRenderer.renderToString(app, ssrContext);

    return html;
  }

  async function renderToStream(ssrContext) {
    ssrContext._registeredComponents =
      ssrContext._registeredComponents || new Set();

    const app = await createApp(ssrContext);

    const res = new PassThrough();

    const renderStream = vueServerRenderer.renderToStream(app, ssrContext);

    renderStream.on('error', function(err) {
      rewriteErrorTrace(err, maps);
      res.emit('error', err);
    });

    // relay HTMLStream special events
    renderStream.on('beforeStart', function() {
      res.emit('beforeStart');
    });
    renderStream.on('beforeEnd', function() {
      res.emit('beforeEnd');
    });

    renderStream.pipe(res);

    return renderStream;
  }

  return {
    renderResources,
    renderToString,
    renderToStream
  };
}

export function createBundleRenderer(_bundle, renderOptions) {
  const { evaluateEntry, rewriteErrorTrace } = bundleRunner.createBundle(
    _bundle,
    renderOptions
  );

  async function createApp(ssrContext, evalContext) {
    try {
      const entry = await evaluateEntry(evalContext);
      console.log('entry', entry);

      const app = await new Promise(async (resolve, reject) => {
        const app1 = await entry(ssrContext);

        resolve(app1);
      })

      console.log('createBundleRenderer app', app);
      return app;
    } catch (err) {
      rewriteErrorTrace(err);
      throw err;
    }
  }

  return createRenderer(createApp, renderOptions);
}

export default { createBundleRenderer, createRenderer };
