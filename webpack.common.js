const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { InjectManifest } = require('workbox-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const getPublicUrlOrPath = require('./src/js/utilities/getPublicUrlOrPath');
const resolvePath = require('./src/js/utilities/resolvePath');
const BuildTimePlugin = require("./src/js/utilities/buildTimePlugin");

require('dotenv').config();
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

module.exports = (env, argv) => {

  // get PUBLIC_URL, which is needed for production builds where process (which is a Node server var), doesn't exist
  const publicUrlOrPath = "/"; // getPublicUrlOrPath(isDevelopmentMode, undefined, process.env.PUBLIC_URL)

  // set whether are creating source maps with prod builds
  const genSourceMaps = false;
  const isProductionMode = process.env.NODE_ENV === 'production';
  const isDevelopmentMode = process.env.NODE_ENV === 'development';

  const PATH = {
    // base: resolvePath('.'),
    // src: resolvePath('./src'),
    // dist: resolvePath('./dist'),
    // public: resolvePath('./public'),
    // assets: resolvePath('./src/assets'),
    // npmPackages: resolvePath('./node_modules'),

    base: resolvePath('../../../'),
    src: resolvePath('../../../src'),
    dist: resolvePath('../../../dist'),
    public: resolvePath('../../../public'),
    assets: resolvePath('../../../src/assets'),
    npmPackages: resolvePath('../../../node_modules'),
  };
  // console.log('PATH', PATH);

  return {
    // mode: isProductionMode ? 'production' : 'development',
    cache: { type: 'filesystem' },
    infrastructureLogging: { level: 'info' },
    stats: 'normal',
    devtool: isProductionMode && genSourceMaps ? 'source-map' : isDevelopmentMode ? 'inline-source-map' : false, // https://webpack.js.org/configuration/devtool/
    externals: {
      path: PATH,
    },
    entry: {
      app: `${ PATH.src }/ts/app.ts`,
    },

    output: {
      path: PATH.dist,
      publicPath: publicUrlOrPath,
      filename: `js/[name].js`,
      assetModuleFilename: (pathData) => {
        // help link: https://stackoverflow.com/a/68902490
        const assetFolderPath = path.dirname(pathData.filename).split("/").slice(1).join("/");
        // console.log('assets filename', pathData.filename, path.dirname(pathData.filename), assetFolderPath);
        // console.log('asses filename', pathData);
        // return `${assetFolderPath}/[name].[hash][ext][query]`;
        return `${assetFolderPath}/[name][ext][query]`;
      },
      clean: true, // clears the output dist folder prior to building

      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: (info) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (isProductionMode) return path.relative('./src', info.absoluteResourcePath).replace(/\\/g, '/')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        else return resolvePath(info.absoluteResourcePath).replace(/\\/g, '/')
      }
    }, // output

    resolve: {
      modules: [PATH.npmPackages, PATH.src],
      // modules: ['src', 'node_modules'], // Assuming that your files are inside the src dir
      // extensions: [".css", ".js", "json"],
      // extensions: ["js", ".txt", "json"],
      extensions: ['.js', '.ts', '.json', '.scss'],
      // alias: {
      //   "@": PATH.src,
      // }
    }, // resolve

    devServer: {
      static: ['./'],
      // static: [ PATH.public ],
      host: 'localhost',
      port: 8080,
      liveReload: true,
      open: true,
      hot: true,
      // historyApiFallback: true,
      // client: {
      //   overlay: {
      //     errors: true,
      //     // warnings: false,
      //     warnings: true,
      //     runtimeErrors: true
      //   }
      // },
      // writeToDisk: false,
      devMiddleware: {
        // writeToDisk: true, // massively speeds up loading of dev server
        writeToDisk: false,
      }
    }, // devServer
    watchOptions: {
      aggregateTimeout: 10000,
      poll: 5000
    },

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
            // In production mode, MiniCSSExtractPlugin extract CSS to file(s), but in development "style" loader enables hot editing of CSS.
            isProductionMode && MiniCssExtractPlugin.loader,

            // In development mode, style loader turns CSS into JS modules that inject <style> tags
            // Adds CSS to the DOM by injecting a `<style>` tag
            isDevelopmentMode && {
              // loader: 'style-loader'
              loader: require.resolve('style-loader'),
            },

            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            // css-loader resolves paths in CSS and adds assets as dependencies
            {
              // loader: 'css-loader'
              loader: require.resolve('css-loader'),
              options: { sourceMap: genSourceMaps }
            },

            // Loader for webpack to process CSS with PostCSS
            // PostCSS loader applies autoprefixer to CSS
            {
              // loader: 'postcss-loader',
              loader: require.resolve('postcss-loader'),
              options: {
                sourceMap: genSourceMaps,
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
                  sourceMap: genSourceMaps,
                  implementation: require.resolve('sass'),
                  mode: isProductionMode ? 'production' : 'development',
                  webpackImporter: false,

                  api: 'modern',
                  silenceDeprecations: ['import', 'global-builtin', 'mixed-decls'],
                  verbose: true,
                  quietDeps: true
                }
              }
            }
          ].filter(Boolean)
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
          resolve: {
            extensions: ['.ts', '.js'] // --> JSON and HTML gets parsed by webpack's internal loaders
          },
          // loader: 'ts-loader',
          loader: require.resolve('ts-loader'),
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
              // loader: 'html-loader',
              loader: require.resolve('html-loader'),
              options: {
                esModule: false,
                sources: {
                  // help link: https://stackoverflow.com/a/72559533
                  urlFilter: (attribute, value, _resourcePath) => {
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
          exclude: `${ PATH.base }/favicon.png`
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
      ], // rules
    }, // module

    plugins: [
      // Generates an `index.html` file with the <script> injected or otherwise
      new HtmlWebpackPlugin({
        title: 'MyJobDone webpackage',
        hash: false,
        // favicon: `${ PATH.src }/assets/images/favicon/favicon.ico`,
        template: `${PATH.src}/index.html`, // template file
        filename: 'index.html', // output file
        inject: false,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }),

      // Copies the public directory into the root of build directory
      // new CopyWebpackPlugin({ patterns: [{ from: 'public' }] }),

      // Makes environment variables available to the build code
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          PUBLIC_URL: JSON.stringify(publicUrlOrPath.slice(0, -1)),
          // APP_BUILD: JSON.stringify(env.APP_BUILD),
          // FUNCTION_APP: JSON.stringify(env.FUNCTION_APP)
        }
      }),

      ...(isProductionMode
        ? [
          // Extracts CSS into separate files
          new MiniCssExtractPlugin({
            // filename: `${ PATH.assets }css/[name].[hash].css`,
            // chunkFilename: `${ PATH.assets }css/[name].css`,
            // filename: ({ chunk }) => `${chunk.name.replace('/js/', '/css/')}/[name].css`,
            // filename: ({ chunk }) => `${chunk.name.replace('app', 'css')}/[name].css`,

            // filename: 'css/[name].[contenthash:8].css',
            // chunkFilename: 'css/[name].[contenthash:8].chunk.css'
            filename: ({_chunk}) => `css/[name].css`,
          }),

          // // Generate a service worker script that will precache, and keep up to date, the HTML & assets that are part of the webpack build
          // new InjectManifest({
          //   swSrc: './src/service-worker.ts',
          //   dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          //   exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
          //   maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB currently to cache large builds, but should split and lazy-load
          // }),

          // // Generate an asset manifest file
          // new WebpackManifestPlugin({
          //   fileName: 'asset-manifest.json',
          //   publicPath: publicUrlOrPath,
          //   generate: (seed, files, entries) => {
          //     const manifestFiles = files.reduce((manifest, file) => {
          //       manifest[file.name] = file.path
          //       return manifest
          //     }, seed)
          //
          //     const entrypointFiles = entries.main.filter(fileName => !fileName.endsWith('.map'))
          //
          //     return {
          //       files: manifestFiles,
          //       entrypoints: entrypointFiles
          //     }
          //   }
          // }),
        ]
        : [
          // Checks code for issues with eslint
          new ESLintPlugin({
            configType: "flat",
            cache: true,
            cacheLocation: ".cache/eslint-webpack-plugin/.eslintcache",
            // formatter: 'html',
            fix: true,
            // files: 'src/**/*.ts',
            // extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
            extensions: ['ts'],
            outputReport: {
              formatter: "json"
            },

            overrideConfigFile: './eslint.config.mjs',
            emitError: true,
            emitWarning: true,
            // eslintPath: require.resolve('eslint'),
            failOnError: true,
            failOnWarning: true,
          }),

          // Used for TS checking - does the checks on a separate process to the build
          // NOTE: This plugin uses TypeScript's, not Webpack's modules resolution (i.e. uses tsconfig.json)
          new ForkTsCheckerWebpackPlugin(),
        ]),

      new BuildTimePlugin(),
    ], // plugins

    optimization: {
      // nodeEnv: false, // do not modify/set the value of process.env.NODE_ENV as this is done by DefinePlugin
      minimizer: [
        // minimise JS
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false
            }
          }
        }),

        // minimise CSS
        new CssMinimizerPlugin(),
      ]
    } // optimization

  } // return
};
