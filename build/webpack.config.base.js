/*
 * @Author: duoduo
 * @Date: 2020-12-08 15:13:38
 * @Last Modified by: zouhuan
 * @Last Modified time: 2021-01-07 20:03:41
 * 编译模式：
 * 1. dev-server 开发环境
 * 2. dev build client环境
 * 3. prd build server环境
 */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const px2rem = require('postcss-plugin-px2rem');

const { VueLoaderPlugin } = require('vue-loader');

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

const resolve = pn => path.resolve(__dirname, `../${pn}`);

console.log('isProd', isProd);

function getStyleLoader(opts = {}) {
  const { isDevServer = false, isSSRServer = false } = opts;
  if (isSSRServer) return 'vue-style-loader';
  if (isProd) return MiniCssExtractPlugin.loader;
  if (isDevServer) return 'style-loader';
  return 'vue-style-loader';
}

module.exports = function(opts = {}) {
  const { isDevServer = false, isSSRServer = false } = opts;

  const config = {
    mode: NODE_ENV,
    devtool: !isProd ? 'cheap-module-source-map' : false,
    stats: 'minimal',
    bail: true,
    target: 'web',
    cache: isProd
      ? false
      : {
          type: 'memory'
        },
    resolve: {
      alias: {
        '@': resolve('src'),
        '/@': resolve('src'),
        public: resolve('public'),
        assets: resolve('src/assets'),
        components: resolve('src/components'),
        utils: resolve('src/utils'),
        vue: 'vue/dist/vue.runtime.esm-bundler'
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.scss', '.css'] // 省略后缀名
    },
    // externals: isSSRServer
    //   ? {}
    //   : {
    //       vue: 'Vue',
    //       vuex: 'Vuex',
    //       'vue-router': 'VueRouter',
    //       vant: 'vant',
    //       mobx: 'mobx',
    //       _: 'lodash'
    //     },
    module: {
      noParse: /es6-promise\.js$/, // avoid webpack shimming process
      rules: [
        // {
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   options: {
        //     failOnError: true
        //   }
        // },
        {
          test: /\.vue$/,
          loader: 'vue-loader', // 处理vue文件，会将ts代码转交给babel-loader
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        },
        {
          test: /\.js(x)$/,
          loader: 'babel-loader',
          include: [resolve('src')]
        },
        {
          test: /\.ts(x)?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  [
                    '@babel/preset-typescript',
                    {
                      allExtensions: true
                    }
                  ]
                ]
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    performance: {
      hints: false
    },
    plugins: [
      new VueLoaderPlugin(),
      // new webpack.ids.HashedModuleIdsPlugin({
      //   hashDigestLength: 20
      // }),
      ...(isProd
        ? []
        : [
            new FriendlyErrorsWebpackPlugin({
              compilationSuccessInfo: {
                messages: ['Your app is running here http://localhost:10001']
              }
            })
          ])
    ]
  };

  const styleLoader = getStyleLoader(opts);

  config.module.rules = config.module.rules.concat([
    {
      test: /\.(sa|sc)ss$/,
      use: [styleLoader, 'css-loader', 'postcss-loader', 'sass-loader']
    },
    {
      test: /\.css$/,
      use: [styleLoader, 'css-loader', 'postcss-loader']
    }
  ]);

  if (!isSSRServer) {
    config.plugins.push(
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          postcss: [
            px2rem({
              exclude: /(node_module)/,
              // rootValue: 10000,
              mediaQuery: false,
              minPixelValue: 0.4
            })
          ]
        }
      })
    );

    if (isProd) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name]-[chunkhash].css' //设置名称
        })
      );

      config.plugins.push(
        new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { safe: true } })
      );

      config.plugins.push(new TerserPlugin());
    }
  }

  return config;
};
