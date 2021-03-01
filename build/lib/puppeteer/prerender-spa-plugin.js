/*
 * @Author: -
 * @Date: 2021-02-26 15:45:02
 * @Last Modified by: zouhuan
 * @Last Modified time: 2021-03-01 10:58:26
 * source: https://github.com/chrisvfritz/prerender-spa-plugin
 * code split out here due to this issue: https://github.com/chrisvfritz/prerender-spa-plugin/pull/415
 */
const path = require('path');
const Prerenderer = require('./prerender');
const PuppeteerRenderer = require('./prerender-puppeteer');
const { minify } = require('html-minifier');

// From https://github.com/ahmadnassri/mkdirp-promise/blob/master/lib/index.js
const mkdirp = function(compiler, dir, opts) {
  return new Promise((resolve, reject) => {
    try {
      return compiler.mkdirp(dir, opts, (err, made) =>
        err === null ? resolve(made) : reject(err)
      );
    } catch (e) {
      return compiler.mkdir(dir, opts, (err, made) =>
        err === null ? resolve(made) : reject(err)
      );
    }
  });
};

const onEmit = (compiler, _options) => (compilation, done) => {
  const PrerendererInstance = new Prerenderer(_options);

  console.log('初始化 PrerendererInstance initialize');
  PrerendererInstance.initialize()
    .then(() => {
      console.log(
        '开始渲染 PrerendererInstance, renderRoutes',
        _options.routes
      );
      return PrerendererInstance.renderRoutes(_options.routes || []);
    })
    // Backwards-compatibility with v2 (postprocessHTML should be migrated to postProcess)
    .then(renderedRoutes => {
      console.log('步骤1 renderedRoutes');

      if (!_options.postProcessHtml) return renderedRoutes;
      return renderedRoutes.map(renderedRoute => {
        const processed = _options.postProcessHtml(renderedRoute);

        console.log('执行渲染 processed', processed);

        if (typeof processed === 'string') renderedRoute.html = processed;
        else renderedRoute = processed;

        return renderedRoute;
      });
    })
    // Run postProcess hooks.
    .then(renderedRoutes => {
      console.log('步骤2 renderedRoutes');
      if (!_options.postProcess) return renderedRoutes;
      return Promise.all(
        renderedRoutes.map(renderedRoute => _options.postProcess(renderedRoute))
      );
    })
    // Check to ensure postProcess hooks returned the renderedRoute object properly.
    .then(renderedRoutes => {
      console.log('路由renderedRoutes', renderedRoutes);

      const isValid = renderedRoutes.every(r => typeof r === 'object');
      if (!isValid) {
        throw new Error(
          '[prerender-spa-plugin] Rendered routes are empty, did you forget to return the `context` object in postProcess?'
        );
      }

      return renderedRoutes;
    })
    // Minify html files if specified in config.
    .then(renderedRoutes => {
      if (!_options.minify) return renderedRoutes;

      renderedRoutes.forEach(route => {
        route.html = minify(route.html, _options.minify);
      });

      return renderedRoutes;
    })
    // Calculate outputPath if it hasn't been set already.
    .then(renderedRoutes => {
      renderedRoutes.forEach(rendered => {
        console.log('renderedRoutes', rendered.outputPath);

        if (!rendered.outputPath) {
          rendered.outputPath = path.join(
            _options.outputDir || _options.staticDir,
            rendered.route,
            'index.html'
          );
        }
      });

      return renderedRoutes;
    })
    // Create dirs and write prerendered files.
    .then(processedRoutes => {
      const promises = Promise.all(
        processedRoutes.map(processedRoute => {
          console.log('processedRoute.outputPath', processedRoute.outputPath);

          return mkdirp(compiler, path.dirname(processedRoute.outputPath), {
            recursive: true
          })
            .then(() => {
              return new Promise((resolve, reject) => {
                compilerFS.writeFile(
                  processedRoute.outputPath,
                  processedRoute.html.trim(),
                  err => {
                    if (err)
                      reject(
                        `[prerender-spa-plugin] Unable to write rendered route to file "${processedRoute.outputPath}" \n ${err}.`
                      );
                    else resolve();
                  }
                );
              });
            })
            .catch(err => {
              if (typeof err === 'string') {
                err = `[prerender-spa-plugin] Unable to create directory ${path.dirname(
                  processedRoute.outputPath
                )} for route ${processedRoute.route}. \n ${err}`;
              }

              throw err;
            });
        })
      );

      return promises;
    })
    .then(r => {
      PrerendererInstance.destroy();
      done();
    })
    .catch(err => {
      console.error('报错了', err);
      PrerendererInstance.destroy();
      const msg = '[prerender-spa-plugin] Unable to prerender all routes!';
      compilation.errors.push(new Error(msg));
      done();
    });
};

class PrerenderSPAPlugin {
  constructor(options = {}) {
    this._options = options;

    if (!this._options.server) {
      this._options.server = {};
    }

    if (!this._options.renderer) {
      this._options.renderer = new PuppeteerRenderer(
        Object.assign({}, { headless: true }, rendererOptions)
      );
    }
  }

  apply(compiler) {
    const compilerFS = compiler.outputFileSystem;
    const afterEmit = onEmit(compilerFS, this._options);
    // console.log('compiler', compiler);

    if (compiler.hooks) {
      const plugin = { name: 'PrerenderSPAPlugin' };
      compiler.hooks.afterEmit.tapAsync(plugin, afterEmit);
    } else {
      compiler.plugin('after-emit', afterEmit);
    }
  }
}

PrerenderSPAPlugin.PuppeteerRenderer = PuppeteerRenderer;

module.exports = PrerenderSPAPlugin;
