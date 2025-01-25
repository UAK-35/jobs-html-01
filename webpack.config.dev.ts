import webpack from 'webpack';
import merge from "webpack-merge";

// @ts-ignore
import common from "./webpack.common";

const config = (env: any, argv: any): webpack.Configuration => {
  return merge(common(env, argv), {
    mode: 'development',
    devServer: {
      open: false,
      port: 5001
    },
  });
};

export default config;
