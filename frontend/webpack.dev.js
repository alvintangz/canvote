// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Webpack merging as discussed in https://webpack.js.org/guides/production/#setup
module.exports = merge(common, {
  mode: 'development',
  // We want to original code
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'inline-source-map',
  entry: {
    devMiddleware: 'webpack/hot/dev-server',
  },
  output: {
    filename: 'js/[name].[chunkhash].bundle.js',
  },
});
