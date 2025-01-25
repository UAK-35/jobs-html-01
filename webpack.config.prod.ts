import webpack from 'webpack';
import merge from "webpack-merge";
import CopyWebpackPlugin from 'copy-webpack-plugin';

// @ts-ignore
import common from "./webpack.common";

const config = (env: any, argv: any): webpack.Configuration => {
  return merge(common(env, argv), {
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
};

export default config;
