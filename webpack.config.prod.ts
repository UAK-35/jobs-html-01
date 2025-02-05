// @ts-ignore
import webpack from 'webpack';
import merge from "webpack-merge";
// @ts-ignore
import CopyWebpackPlugin from 'copy-webpack-plugin';

// @ts-ignore
import common from "./webpack.common";

import Constants from "./src/ts/lib/constants";
// @ts-ignore
import path from "path";

const config = (env: any, argv: any): webpack.Configuration => {
  const PATH = Constants.folderPaths;

  return merge(common(env, argv), {
    mode: 'production',
    output: {
      path: PATH.dist + path.sep + Constants.envValues.envMode
    },
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
