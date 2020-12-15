/*
 * @Author: duoduo
 * @Date: 2020-12-08 15:13:38
 * @Last Modified by: duoduo
 * @Last Modified time: 2020-12-09 16:22:21
 * 编译模式：
 * 1. dev-server 开发环境
 * 2. dev build client环境
 * 3. prd build server环境
 */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const px2rem = require('postcss-plugin-px2rem');

const { VueLoaderPlugin } = require('vue-loader');

const isProd = process.env.NODE_ENV === 'production';

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
    devtool: isProd ? false : 'cheap-module-source-map',
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
        public: resolve('public'),
        assets: resolve('src/assets'),
        components: resolve('src/components'),
        utils: resolve('src/utils'),
        vue$: 'vue/dist/vue.esm.js'
      },
      extensions: ['.js', '.ts', '.vue', '.scss', '.css'] // 省略后缀名
    },
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      vant: 'vant',
      mobx: 'mobx',
      _: 'lodash'
    },
    module: {
      noParse: /es6-promise\.js$/, // avoid webpack shimming process
      rules: [
        {
          test: /\.vue$/,
          use: [
            // {
            //   loader: 'cache-loader',
            // },
            {
              loader: 'vue-loader', // 处理vue文件，会将ts代码转交给babel-loader
              options: {
                compilerOptions: {
                  preserveWhitespace: false
                }
              }
            }
          ]
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.tsx?$/,
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
      new VueLoaderPlugin()
      // new webpack.ids.HashedModuleIdsPlugin({
      //   hashDigestLength: 20
      // })
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
      use: [styleLoader, 'css-loader']
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
          filename: '[name].[chunkhash].css' //设置名称
        })
      );

      config.plugins.push(
        new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { safe: true } })
      );

      config.plugins.push(new TerserPlugin());
    } else {
      config.plugins.push(new FriendlyErrorsPlugin());
    }
  }

  return config;
};
