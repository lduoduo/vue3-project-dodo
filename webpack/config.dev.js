const path = require('path');
const webpack = require('webpack');
// const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { merge } = require('webpack-merge');

const getConfig = require('./config.base.js');

const resolve = pn => path.resolve(__dirname, `../${pn}`);

const port = process.env.PORT || 10001;

const baseConfig = getConfig({ isDevServer: true });

module.exports = merge(baseConfig, {
  stats: 'errors-only',
  mode: 'development',
  entry: resolve('src/main.ts'),
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  devServer: {
    disableHostCheck: true,
    publicPath: '/',
    // contentBase: dist,
    host: 'localhost',
    port,
    // compress: true,
    hot: true,
    inline: true,
    index: 'index.html',
    writeToDisk: true,
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: '/index.html' }]
    },
    // openPage: getOpenUrl(),
    // useLocalIp: true,
    before: function(app, server, compiler) {
      // app.get('*', function(req, res) {
      //   console.log('req', req.path);
      //   // res.render('index', { title: 'dodo' });
      //   res.send('index.html');
      // });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"', VUE_ENV: '"client"' },
      __IS_PROD__: false,
      __SERVER__: false
    }),
    // new webpack.BannerPlugin('最终版权归dodo所有'), // 横幅的配置(版权)
    new HtmlWebpackPlugin({
      template: resolve('w-template/t-dev.html'),
      filename: 'index.html',
      inject: true
    })
  ]
});
