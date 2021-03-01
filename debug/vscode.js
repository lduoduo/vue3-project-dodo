const webpack = require('webpack');
const config = require('../build/webpack.config.csr');

// compiler是webpack的启动入口，直接调用即可
const compiler = webpack(config);
compiler.run();
