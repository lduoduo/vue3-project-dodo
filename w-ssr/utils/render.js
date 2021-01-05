const path = require('path');
const { green, red } = require('chalk');
const isProd = process.env.NODE_ENV === 'production';

const Readable = require('stream').Readable;

const resolve = pn => path.resolve(__dirname, pn);

const template = require('fs').readFileSync(
  resolve('../../w-template/t-ssr.html'),
  'utf-8'
);

function errorHandler(err, ctx, next) {
  // if (err.url) {
  //   res.redirect(err.url);
  // } else if (err.code === 404) {
  //   res.status(404).send('404 | Page Not Found');
  // } else {
  //   // Render Error Page or Redirect
  //   res.status(500).send('500 | Internal Server Error');

  //   console.error(red(`error during render : ${req.url}`));
  //   console.error(red(err.stack));
  // }

  console.error(red(err.stack));

  next();
}

async function renderToString(renderer, context, ctx, next) {
  const now = Date.now();

  console.log('now', now, context);

  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！

  // if(1) {
  //   ctx.body = str;
  //   next();
  //   return;
  // }

  try {
    const content = await renderer.renderToString(context);

    // renderer.renderToString(context, (err, html) => {
    //   console.log('err html', err, html);
    //   if (err) {
    //     ctx.status = 500;
    //     // ctx.redirect('/cart');
    //     ctx.body = `<div style="color: red;">${err.message}</div>`;
    //     return;
    //   }
    // ctx.body = html;
    // });

    const html = template
      .replace(
        '</head>',
        `${content.renderResourceHints()}${content.renderStyles()}`
      )
      .replace('<!--vue-ssr-outlet-->', `<div id="app">${content.html}</div>`)
      .replace('</body>', `${content.renderScripts()}`);

    // const html = `
    // <!DOCTYPE html>
    // <html>
    //   <head>
    //     ${content.renderResourceHints()}
    //     ${content.renderStyles()}
    //     <title>Hello Vue 3</title>
    //   </head>
    //   <body>
    //     <div id="app">${content.html}</div>
    //     ${content.renderScripts()}
    //   </body>
    // </html>
    //     `;

    ctx.body = html;
    next();

    // if (!isProd) {
    //   // eslint-disable-next-line no-console
    //   console.log(green(`Whole request took: ${Date.now() - now}ms`));
    // }
  } catch (err) {
    errorHandler(err, ctx, next);
  }
}

async function renderToStream(renderer, context, ctx, next) {
  const now = Date.now();

  console.log('now', now, context);

  /** 必须 */
  const view = new Readable();
  view._read = () => {};

  ctx.body = view;
  ctx.type = 'html';

  try {
    const resources = renderer.renderResources(context);

    const str = template.match(/^([\s\S]+)id="app">([\s\S]+)$/);

    const prefix =
      str[1].replace(
        '</head>',
        `${resources.renderResourceHints()}${resources.renderStyles()}</head>`
      ) + 'data-server-rendered="true" id="app">';

    const postfix = str[2].replace(
      '</body>',
      `${resources.renderScripts()}</body>`
    );

    view.push(prefix);

    const stream = await renderer.renderToStream(context);

    // renderer.renderToString(context, (err, html) => {
    //   console.log('err html', err, html);
    //   if (err) {
    //     ctx.status = 500;
    //     // ctx.redirect('/cart');
    //     ctx.body = `<div style="color: red;">${err.message}</div>`;
    //     return;
    //   }
    // ctx.body = html;
    // });

    // const html = template
    //   .replace(
    //     '</head>',
    //     `${content.renderResourceHints()}${content.renderStyles()}`
    //   )
    //   .replace('<!--vue-ssr-outlet-->', `<div id="app">${content.html}</div>`)
    //   .replace('</body>', `${content.renderScripts()}`);

    stream.on('data', data => {
      // console.log('onData', data.toString());
      //全部写完后，结束掉http response
      view.push(data.toString());
    });

    stream.on('end', () => {
      console.log('stream end'); // 渲染完成

      view.push(postfix);

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

    // if (!isProd) {
    //   // eslint-disable-next-line no-console
    //   console.log(green(`Whole request took: ${Date.now() - now}ms`));
    // }
  } catch (err) {
    errorHandler(err, ctx, next);
  }
}

module.exports = { renderToString, renderToStream };
