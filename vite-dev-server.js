const { createServer } = require('vite');
const path = require('path');

const PORT = process.env.PORT || 10001;

const cookies = {
  current: null
};

const config = {
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: '/',
  /**
   * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
   * @default 'dist'
   */
  outDir: 'dist',
  port: 8080,
  cors: true,
  emitManifest: true,
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: true,
  // 引入第三方的配置
  optimizeDeps: {
    include: ['moment', 'echarts', 'axios', 'mockjs'],
    exclude: ['koa2', 'koa-body']
  },
  alias: {
    // vite中alias必须以斜线开头和结尾，暂时未知原因，这样其实挺不方便的
    // 所以在eslint配置alias和文件中导入路径也要相应的修改
    '/@': path.resolve(__dirname, './src')
  },
  //这里注意，键名是scss不是sass！一字之差能让你折腾好久
  scss: {
    //这里写你想导入全局scss变量的路径
    //这里注意只能写相对路径，alias貌似在css中不会生效
    additionalData: "@import './src/style/a.scss';"
  },
  proxy: {
    // '/api': 'http://127.0.0.1:10002',
    // 如果是 /api 打头，则访问地址如下
    '/api': {
      target: 'http://127.0.0.1:10002',
      headers: {
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty'
      },
      changeOrigin: true, // 是否跨域
      secure: true, // 是否https接口
      logs(ctx, target) {
        console.log(
          '%s - %s %s proxy to -> %s',
          new Date().toISOString(),
          ctx.req.method,
          ctx.req.oldPath,
          new URL(ctx.req.url, target)
        );
      },
      // rewrite: (e, a) => {
      //   console.log('rewrite e', e);
      //   console.log('rewrite a', a);
      //   console.log('new Date', new Date().toLocaleTimeString());
      //   return e;
      // }
      events: {
        error(err, req, res) {
          console.log('err', err);
        },
        proxyReq(proxyReq, req, res) {
          proxyReq._headers.cookie = proxyReq._headers.cookie || cookies.current;
          console.log('\nproxyReq headers', proxyReq._headers);
        },
        proxyRes(proxyRes, req, res) {
          console.log('\nstatusCode', proxyRes.statusCode);
          console.log('\nstatusMessage', proxyRes.statusMessage);
          console.log('\nheaders', proxyRes.headers, req.headers);
          console.log('\nproxyRes', proxyRes);

          proxyRes.headers["access-control-allow-origin"] = req.headers['origin'];

          if (proxyRes.headers["set-cookie"] !== undefined) {
            console.log("** SET-COOKIE: ", proxyRes.headers["set-cookie"]);
            cookies.current = proxyRes.headers["set-cookie"].map(d => d.replace(/Path=.+$/, '')).join(';');
            console.log('cookies.current', cookies.current);
            proxyRes.headers["set-cookie"] = proxyRes.headers["set-cookie"].map(d => d.replace(/Domain=\w+\.\w+;/ ,``))
          }
        }
      }
    }
  }
};

const myPlugin = ({
  root, // project root directory, absolute path
  app, // Koa app instance
  server, // raw http server instance
  watcher // chokidar file watcher instance
}) => {
  app.use(async (ctx, next) => {
    // You can do pre-processing here - this will be the raw incoming requests
    // before vite touches it.

    if (1) return next();

    if (ctx.path.endsWith('.scss')) {
      // Note vue <style lang="xxx"> are supported by
      // default as long as the corresponding pre-processor is installed, so this
      // only applies to <link ref="stylesheet" href="*.scss"> or js imports like
      // `import '*.scss'`.
      console.log('pre processing: ', ctx.url);
      ctx.type = 'css';
      ctx.body = 'body { border: 1px solid red }';
    }

    // ...wait for vite to do built-in transforms
    await next();

    // Post processing before the content is served. Note this includes parts
    // compiled from `*.vue` files, where <template> and <script> are served as
    // `application/javascript` and <style> are served as `text/css`.
    if (ctx.response.is('js')) {
      console.log('post processing: ', ctx.url);
      console.log(ctx.body); // can be string or Readable stream
    }
  });
};

createServer({ ...config, configureServer: [myPlugin] }).listen(PORT);
