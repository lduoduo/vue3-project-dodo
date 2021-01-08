import * as path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { Readable } from 'stream';

const { green, red } = chalk;

const isProd = process.env.NODE_ENV === 'production';

const __dirname =
  '/' + path.dirname(import.meta.url).replace(/^file:\/\/\//, '');

console.log('__dirname', __dirname);

const resolve = pn => path.join(__dirname, pn);

const template = fs.readFileSync(
  resolve('../../w-template/t-ssr.html'),
  'utf-8'
);

async function errorHandler(err, ctx, next, view) {
  console.error(red(err.stack));

  if (view) {
    view.push(`<div style="color: red;">${err.message}</div>`);
    view.push(null);
  } else {
    ctx.body = `<div style="color: red;">${err.message}</div>`;
  }
}

export async function renderToString(renderer, context, ctx, next) {
  const now = new Date();

  console.log('now', now, context);

  ctx.type = 'html';

  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
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

    const content = await renderer.renderToString(context);

    const html = `${prefix}${content}${postfix}`;

    ctx.body = html;

    await next();

    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log(green(`Whole request took: ${new Date() - now}ms`));
    }
  } catch (err) {
    await errorHandler(err, ctx, next);
  }
}

export async function renderToStream(renderer, context, ctx, next) {
  const now = new Date();

  console.log('now', now.toString(), context);

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

    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log(green(`Whole request took: ${new Date() - now}ms`));
    }
  } catch (err) {
    await errorHandler(err, ctx, next, view);
  }
}

export default { renderToString, renderToStream };
