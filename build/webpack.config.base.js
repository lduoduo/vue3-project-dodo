/*
 * @Author: duoduo
 * @Date: 2020-12-08 15:13:38
 * @Last Modified by: zouhuan
 * @Last Modified time: 2021-01-05 13:18:30
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

const { VueLoaderPlugin } = require('vue-loader-v16');

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
        utils: resolve('src/utils')
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
          loader: 'vue-loader-v16', // 处理vue文件，会将ts代码转交给babel-loader
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
              rootValue: 75, //换算基数， 默认100 ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
              // unitPrecision: 5, //允许REM单位增长到的十进制数字。
              //propWhiteList: [], //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
              // propBlackList: [], //黑名单
              exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
              // selectorBlackList: [], //要忽略并保留为px的选择器
              // ignoreIdentifier: false, //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
              // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
              mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
              minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
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
    }
  }

  return config;
};
