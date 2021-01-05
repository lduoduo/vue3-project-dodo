const path = require('path');
const Koa = require('koa2');
const staticCache = require('koa-static-cache');

const vueServerRenderer = require('@vue/server-renderer');
const { createBundleRenderer } = require('./utils/vue-bundle-renderer.cjs');

const { renderToStream, renderToString } = require('./utils/render');

const resolve = pn => path.resolve(__dirname, pn);

const isProd = true; // process.env.NODE_ENV === 'production';

const app = new Koa();

const port = process.env.PORT || 10001;

global.env = process.env.NODE_ENV || 'production';

app.use(
  staticCache(resolve('../dist'), {
    prefix: '/dist',
    maxAge: 365 * 24 * 60 * 60
  })
);

app.use(
  staticCache(resolve('../public'), {
    maxAge: 365 * 24 * 60 * 60
  })
);

let renderer;
let readyPromise;

if (isProd) {
  const serverBundle = require('../dist/vue-ssr-server-bundle.json');
  const clientManifest = require('../dist/vue-ssr-client-manifest.json');

  renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    runInNewContext: false,
    vueServerRenderer
  });
} else {
  const devServer = require('../build/webpack.config.ssr.devServer');

  readyPromise = devServer(app, (serverBundle, options) => {
    console.log('devServer options', options);

    renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false,
      vueServerRenderer,
      ...options
    });

    console.log('renderer', renderer);
  });
}

//ssr 中间件
app.use(async (ctx, next) => {
  const context = { url: ctx.req.url };
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！

  if (isProd) {
    renderToStream(renderer, context, ctx, next);
  } else {
    readyPromise.then(() => renderToStream(renderer, context, ctx, next));
  }
});

//启动服务
app.listen(port, () => {
  console.log('\n\n SERVER APP @', `http://localhost:${port}\n`);
});
