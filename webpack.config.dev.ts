import webpack from 'webpack';
import merge from "webpack-merge";

// @ts-ignore
import common from "./webpack.common";

import Constants from "./src/ts/lib/constants";
import path from "path";

const config = (env: any, argv: any): webpack.Configuration => {
  const PATH = Constants.folderPaths;

  return merge(common(env, argv), {
    mode: 'development',
    output: {
      path: PATH.dist + path.sep + Constants.envValues.envMode
    },
    devServer: {
      open: false,
      port: 5001
    },
  });
};

export default config;
