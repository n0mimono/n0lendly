const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    contentBase: 'dist',
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false
      },
      '/login': {
        target: 'http://localhost:8080',
        secure: false
      },
      '/logout': {
        target: 'http://localhost:8080',
        secure: false
      },
    }
  },
});
