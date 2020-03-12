const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pages = require('./pages.config');
const pagesScripts = require('./pages-scripts.config');

const getEntry = () => {
  let entry = {};
  pagesScripts.forEach((script) => {
    entry = Object.assign(entry, { [script.name]: path.resolve(__dirname, `app/src/${script.path}`) });
  });
  return entry;
};

const getPlugins = () => pages.map((page) => new HtmlWebpackPlugin({
  filename: page.htmlFile,
  template: `./app/html/${page.htmlFile}`,
  chunks: page.scripts,
}));

module.exports = {
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // https://github.com/babel/babel-loader/blob/master/README.md
        // Babel Presets in babel configuration file (.babelrc) - includes a react preset
        // Note: "use strict" is added upon by babel
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        resolve: {
          modules: [
            path.resolve(__dirname, 'components'),
            path.resolve('node_modules'),
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    ],
  },
  optimization: {
    // Reference: https://github.com/webpack/webpack/tree/master/examples/many-pages
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: getPlugins(),
};
