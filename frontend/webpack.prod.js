// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Webpack merging as discussed in https://webpack.js.org/guides/production/#setup
module.exports = merge(common, {
  // By default, webpack will minify code in production mode
  // https://webpack.js.org/guides/production/#minification
  mode: 'production',
  // Source Mapping: https://webpack.js.org/guides/production/#source-mapping
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[chunkhash].bundle.min.js',
  },
});
