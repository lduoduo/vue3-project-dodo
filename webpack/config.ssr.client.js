const path = require('path');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const { merge } = require('webpack-merge');

const getConfig = require('./config.base.js');

const resolve = pn => path.resolve(__dirname, `../${pn}`);

const isProd = process.env.NODE_ENV === 'production';

const baseConfig = getConfig();

module.exports = merge(baseConfig, {
  mode: isProd ? 'production' : 'development',
  entry: resolve('w-ssr/entry-client-before-page.ts'),
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
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
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
});
