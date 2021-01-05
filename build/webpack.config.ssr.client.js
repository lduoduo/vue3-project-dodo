const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { VueSSRClientPlugin } = require('./lib/client.plugin');

const getConfig = require('./webpack.config.base.js');

const resolve = pn => path.resolve(__dirname, `../${pn}`);

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = getConfig();

const clientConfig = merge(baseConfig, {
  mode: isProd ? 'production' : 'development',
  // mode: 'development',
  entry: {
    app: resolve('w-ssr/entry-client-before-page.ts'),
  },
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
  optimization: {
    runtimeChunk: {
      // extract webpack runtime & manifest to avoid vendor chunk hash changing
      // on every build.
      name: "manifest",
    },

    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development",
      ),
      "process.env.VUE_ENV": '"client"',
      "process.browser": true,
      "process.server": false,
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
});


module.exports = clientConfig;
