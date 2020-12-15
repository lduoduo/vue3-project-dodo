const path = require('path');
const Koa = require('koa2');
const staticCache = require('koa-static-cache');
const Readable = require('stream').Readable;

const { createBundleRenderer } = require('vue-server-renderer');

const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');

const resolve = pn => path.resolve(__dirname, pn);

const template = require('fs').readFileSync(
  resolve('../w-template/t-ssr.html'),
  'utf-8'
);

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template, // （可选）页面模板
  clientManifest, // （可选）客户端构建 manifest
  basedir: resolve('../dist') // 显式地声明 server bundle 的运行目录。运行时将会以此目录为基准来解析 node_modules 中的依赖模块。只有在所生成的 bundle 文件与外部的 NPM 依赖模块放置在不同位置，或者 vue-server-renderer 是通过 NPM link 链接到当前项目中时，才需要配置此选项
});

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

//ssr 中间件
app.use(async (ctx, next) => {
  const context = { url: ctx.req.url };

  /** 必须 */
  const view = new Readable();
  view._read = () => {};

  ctx.body = view;
  ctx.type = 'html';

  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  const stream = renderer.renderToStream(context);

  stream.on('data', data => {
    // console.log('onData', data.toString());
    //全部写完后，结束掉http response
    view.push(data.toString());
  });

  stream.on('end', () => {
    console.log('stream end'); // 渲染完成
    //全部写完后，结束掉http response
    view.push(null);
  });

  stream.on('error', err => {
    console.log('stream error', err);
    //全部写完后，结束掉http response
    view.push(`<div style="color: red;">${err.message}</div>`);
    view.push(null);
  });

  await next();
});

//启动服务
app.listen(port, () => {
  console.log('\n\n SERVER APP @', `http://localhost:${port}\n`);
});
