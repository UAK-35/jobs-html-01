const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => merge(common(env, argv), {
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/robots.txt', to: 'robots.txt' },
        { from: './src/404.html', to: '404.html' },
        { from: './src/site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});
