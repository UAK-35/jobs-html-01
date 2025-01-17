const path = require('path');
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ESLintPlugin = require('eslint-webpack-plugin');

require('dotenv').config();
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const resolve = pathString => {
  return path.resolve(__dirname, pathString);
}

const PATH = {
  src: resolve('./src'),
  dist: resolve('./dist'),
  // public: 'public/',
  public: resolve('./public'),
  // assets: 'assets/',
  assets: resolve('./src/assets'),
  base: resolve('.')
};

module.exports = {
  externals: {
    path: PATH,
  },
  entry: {
    app: `${ PATH.src }/ts/app.ts`,
  },
  output: {
    // publicPath: "/",
    filename: `js/[name].js`,
    path: PATH.dist,
    assetModuleFilename: (pathData) => {
      // help link: https://stackoverflow.com/a/68902490
      const assetFolderPath = path.dirname(pathData.filename).split("/").slice(1).join("/");
      console.log('assets filename', pathData.filename, path.dirname(pathData.filename), assetFolderPath);
      // console.log('asses filename', pathData);
      // return `${assetFolderPath}/[name].[hash][ext][query]`;
      return `${assetFolderPath}/[name][ext][query]`;
    },
    clean: true
  },
  resolve: {
    // extensions: [".css", ".js", "json"],
    extensions: ["json"],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'MyJobDone webpackage',
      hash: false,
      // favicon: `${ PATH.src }/assets/images/favicon/favicon.ico`,
      template: `${ PATH.src }/index.html`, // template file
      filename: 'index.html', // output file
      inject: false,
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }),

    new MiniCssExtractPlugin({
      // filename: `${ PATH.assets }css/[name].[hash].css`,
      // chunkFilename: `${ PATH.assets }css/[name].css`,
      // filename: ({ chunk }) => `${chunk.name.replace('/js/', '/css/')}/[name].css`,
      // filename: ({ chunk }) => `${chunk.name.replace('app', 'css')}/[name].css`,
      filename: ({ chunk }) => `css/[name].css`,
    }),

    new ESLintPlugin({
      configType: "flat",
      cache: true,
      cacheLocation: ".cache/eslint-webpack-plugin/.eslintcache",
      // formatter: 'html',
      fix: true,
      // files: 'src/**/*.ts',
      extensions: ['ts'],
      outputReport: true,

      overrideConfigFile: './eslint.config.mjs',
      emitError: true,
      emitWarning: true,
      // eslintPath: require.resolve('eslint'),
      failOnError: true,
      failOnWarning: true,
    }),
  ],
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: "css-loader",
      //       options: {
      //         sourceMap: true
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // {
          //   // Adds CSS to the DOM by injecting a `<style>` tag
          //   loader: 'style-loader'
          // },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
            options: {
              sassOptions: {
                api: 'modern',
                silenceDeprecations: ['import', 'global-builtin', 'mixed-decls'],
                verbose: true,
                quietDeps: true
              }
            }
          }
        ]
      },
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   use:[
      //     {loader: 'style-loader'},
      //     {loader: 'css-loader'}
      //   ]
      // },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        // options: {
        //   plugins: [
        //     new ESLintPlugin({
        //       configType: "flat",
        //       cache: true,
        //       cacheLocation: ".cache/eslint-webpack-plugin/.eslintcache",
        //       fix: true,
        //       // files: 'src/**/*.ts',
        //       extensions: ['ts'],
        //       outputReport: true
        //     }),
        //   ]
        // }
      },
      {
        test: /\.html$/,
        // loader: "html-loader",
        // use: [
        //   'html-loader',
        // ],
        use: [
          // {
          //   loader: 'file-loader',
          //   options: {
          //     name: '[name].html'
          //   }
          // },
          // 'extract-loader',
          {
            // help link: https://stackoverflow.com/a/72485442
            loader: 'html-loader',
            options: {
              esModule: false,
              sources: {
                // help link: https://stackoverflow.com/a/72559533
                urlFilter: (attribute, value, resourcePath) => {
                  // console.log('value', attribute, value, resourcePath);
                  if (!(attribute === "content" || value === "./css/app.css" || value === "./site.webmanifest" || value === "./js/app.js")) {
                    return true;
                  }
                  return false;
                },
              }
            },
          },
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        exclude: [
          `${PATH.base}/favicon.png`
        ]
      },
      // {
      //   test: /\.png$/,
      //   type: 'asset/inline'
      // },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // {
      //   enforce: 'pre',
      //   test: /\.ts$/,
      //   loader: 'tslint-loader',
      //   exclude: /node_modules/
      // }
    ]
  }
}
