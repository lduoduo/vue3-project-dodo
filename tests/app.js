const path = require('path');
const Koa = require('koa2');
const koaBody = require('koa-body');

const resolve = pn => path.resolve(__dirname, pn);

const app = new Koa();

const port = process.env.PORT || 10002;

global.env = process.env.NODE_ENV || 'production';

app.use(koaBody());

//ssr 中间件
app.use((ctx, next) => {
  const context = { url: ctx.req.url };

  console.log('ctx.req.url', ctx.req.url);
  console.log('ctx.req.headers', ctx.req.headers);
  console.log('ctx.request.body', ctx.request.body);
  console.log('new Date', new Date().toLocaleTimeString());
  ctx.body = 'aaa';
  next();
});

//启动服务
app.listen(port, () => {
  console.log('\n\n SERVER APP @', `http://localhost:${port}\n`);
});
