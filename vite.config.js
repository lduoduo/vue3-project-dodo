// const path = require("path");
import path from 'path';

export default {
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: '/',
  /**
   * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
   * @default 'dist'
   */
  outDir: 'dist',
  port: 10001,
  cors: true,
  emitManifest: true,
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  // 引入第三方的配置
  optimizeDeps: {
    include: ['moment', 'echarts', 'axios', 'mockjs']
  },
  alias: {
    // vite中alias必须以斜线开头和结尾，暂时未知原因，这样其实挺不方便的
    // 所以在eslint配置alias和文件中导入路径也要相应的修改
    '/@/': path.resolve(__dirname, './src')
    // '/@components/': path.resolve(__dirname, './src/components')
  },
  proxy: {
    '/api': 'http://127.0.0.1:10002'
    // 如果是 /api 打头，则访问地址如下
    // '/api': {
    //   target: 'http://127.0.0.1:10002',
    //   changeOrigin: true,
    //   // rewrite: path => path.replace(/^\/api/, '')
    // }
  }
};
