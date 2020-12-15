const path = require('path');
const webpack = require('webpack');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

const getConfig = require('./config.base.js');

const resolve = pn => path.resolve(__dirname, `../${pn}`);

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = getConfig();

module.exports = merge(baseConfig, {
  mode: isProd ? 'production' : 'development',
  entry: resolve('src/main.ts'),
  output: {
    path: resolve('dist-csr'),
    publicPath: '/',
    filename: '[name].[chunkhash].js'
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
  optimization: {
    moduleIds: 'named',
    chunkIds: 'deterministic',
    splitChunks: {
      name: false,
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 10
        }
      },
      minSize: {
        javascript: 30000,
        style: 30000
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"', VUE_ENV: '"client"' },
      __IS_PROD__: !!isProd,
      __SERVER__: false
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {
          filename: 'index.html',
          inject: true,
          template: resolve('w-template/t-csr.html')
        },
        isProd
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      )
    ),
    new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: resolve('dist-csr'),
      routes: [
        '/about',
        '/',
        '/m/categorylist',
        '/m/hotlist',
        '/m/pyqlist',
        '/m/mine'
      ],
      postProcess(renderedRoute) {
        // add CDN
        // 由于CDN是以"/"结尾的，所以资源开头的“/”去掉
        // renderedRoute.html = renderedRoute.html.replace('xxx', 'xx')
        return renderedRoute;
      },
      renderer: new Renderer({
        // Optional - defaults to 0, no limit.
        // Routes are rendered asynchronously.
        // Use this to limit the number of routes rendered in parallel.
        maxConcurrentRoutes: 5,
        // Optional - The name of the property to add to the window object with the contents of `inject`.
        injectProperty: '__PRERENDER_INJECTED',
        // inject: { prerender: 'domain' },
        headless: false,

        inject: {
          title: 'dodo'
        },
        // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，vue可能需要使用预渲染何时开始的事件, 两者的事件名称要对应上。
        renderAfterDocumentEvent: 'render-event',
        renderAfterTime: 5000, //超时时间
        timeout: 0,
        maxConcurrentRoutes: 20, //打包页面的最大数
        navigationParams: {
          timeout: 0
        }
      })
    })
  ]
});
