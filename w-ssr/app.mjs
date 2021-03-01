import path from 'path';
import fs from 'fs';
import Koa from 'koa2';
import staticCache from 'koa-static-cache';

import vueServerRenderer from '@vue/server-renderer';
import VueBundleRender from './utils/vue-bundle-renderer.mjs';
const { createBundleRenderer } = VueBundleRender;

import devServer from '../build/webpack.config.ssr.devServer.js';

import pkg from './utils/render.mjs';
const { renderToStream, renderToString } = pkg;

const __dirname =
  '/' + path.dirname(import.meta.url).replace(/^file:\/\/\//, '');

const resolve = pn => path.join(__dirname, pn);

const isProd = process.env.SERVER_ENV === 'production';

const app = new Koa();

const port = process.env.PORT || 10001;

global.env = process.env.SERVER_ENV || 'production';

const cacheOpts = isProd
  ? { dynamic: true, maxAge: 365 * 24 * 60 * 60 }
  : { dynamic: true };

app.use(
  staticCache(resolve('../dist'), {
    prefix: '/dist',
    ...cacheOpts
  })
);

app.use(staticCache(resolve('../public'), cacheOpts));

let renderer;
let readyPromise;

console.log('server', isProd, process.env.SERVER_ENV);

if (isProd) {
  const serverBundle = JSON.parse(
    fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'))
  );
  const clientManifest = JSON.parse(
    fs.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'))
  );

  renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    runInNewContext: false,
    vueServerRenderer
  });
} else {
  readyPromise = devServer(app, (serverBundle1, options) => {
    // console.log('devServer options', options);

    renderer = createBundleRenderer(serverBundle1, {
      runInNewContext: false,
      vueServerRenderer,
      ...options
    });
  });
}

//ssr 中间件
app.use(async (ctx, next) => {
  if (/__webpack_hmr/.test(ctx.req.url)) return await next();
  if (/^\/dist/.test(ctx.req.url)) return await next();

  const context = { url: ctx.req.url };
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！

  if (isProd) {
    renderToStream(renderer, context, ctx, next);
  } else {
    readyPromise.then(() => renderToStream(renderer, context, ctx, next));
  }
});

// app.use(async (ctx, next) => {
//   ctx.body = '404';
//   await next();
// });

//启动服务
app.listen(port, () => {
  console.log('\n\n SERVER APP @', `http://localhost:${port}\n`);
});
