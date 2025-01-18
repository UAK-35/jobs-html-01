const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { InjectManifest } = require('workbox-webpack-plugin');
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const getPublicUrlOrPath = require('./src/js/utilities/getPublicUrlOrPath');
const resolvePath = require('./src/js/utilities/resolvePath');
const BuildTimePlugin = require("./src/js/utilities/buildTimePlugin");

const envMode = process.env.NODE_ENV;
console.log('NODE_ENV', envMode);
const isDevelopmentEnv = envMode === 'development';
const isStagingEnv = envMode === 'staging';
const isProductionEnv = isStagingEnv || envMode === 'production';

const envFile = `.env${isProductionEnv ? "" : "." + envMode}`;
console.info("environment file = " + envFile);

require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });

module.exports = (env, _argv) => {

  const publicUrl = process.env.PUBLIC_URL;
  console.log('PUBLIC_URL', publicUrl);

  // set whether are creating source maps with prod builds
  const genSourceMaps = false;

  // get PUBLIC_URL, which is needed for production builds where process (which is a Node server var), doesn't exist
  const publicUrlOrPath = getPublicUrlOrPath(isDevelopmentEnv, undefined, publicUrl);
  console.log('publicUrlOrPath', publicUrlOrPath);

  const PATH = {
    base: resolvePath('../../../'),
    src: resolvePath('../../../src'),
    dist: resolvePath('../../../dist'),
    public: resolvePath('../../../public'),
    assets: resolvePath('../../../src/assets'),
    npmPackages: resolvePath('../../../node_modules'),
  };
  // console.log('PATH', PATH);

  return {
    mode: isProductionEnv ? 'production' : 'development',
    cache: { type: 'filesystem' },
    infrastructureLogging: { level: 'info' },
    stats: 'normal',
    devtool: isProductionEnv && genSourceMaps ? 'source-map' : isDevelopmentEnv ? 'inline-source-map' : false, // https://webpack.js.org/configuration/devtool/
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
        return `${assetFolderPath}/[name][ext][query]`;
      },
      clean: true, // clears the output dist folder prior to building

      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: (info) => {
        if (isProductionEnv) return path.relative('./src', info.absoluteResourcePath).replace(/\\/g, '/')
        else return resolvePath(info.absoluteResourcePath).replace(/\\/g, '/')
      }
    }, // output

    resolve: {
      modules: [PATH.npmPackages, PATH.src],
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
        {
          test: /\.(scss)$/,
          use: [
            // In production mode, MiniCSSExtractPlugin extract CSS to file(s), but in development "style" loader enables hot editing of CSS.
            isProductionEnv && MiniCssExtractPlugin.loader,

            // In development mode, style loader turns CSS into JS modules that inject <style> tags
            // Adds CSS to the DOM by injecting a `<style>` tag
            isDevelopmentEnv && {
              loader: require.resolve('style-loader'),
            },

            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            // css-loader resolves paths in CSS and adds assets as dependencies
            {
              loader: require.resolve('css-loader'),
              options: { sourceMap: genSourceMaps }
            },

            // Loader for webpack to process CSS with PostCSS
            // PostCSS loader applies autoprefixer to CSS
            {
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
                  mode: isProductionEnv ? 'production' : 'development',
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

        {
          test: /\.ts$/,
          exclude: /node_modules/,
          resolve: {
            extensions: ['.ts', '.js'] // --> JSON and HTML gets parsed by webpack's internal loaders
          },
          loader: require.resolve('ts-loader'),
        },

        {
          test: /\.html$/,
          use: [
            {
              // help link: https://stackoverflow.com/a/72485442
              loader: require.resolve('html-loader'),
              options: {
                esModule: false,
                sources: {
                  // help link: https://stackoverflow.com/a/72559533
                  urlFilter: (attribute, value, _resourcePath) => {
                    // console.log('value', attribute, value, resourcePath);
                    return !(attribute === "content" || value === "./css/app.css" || value === "./site.webmanifest" || value === "./js/app.js");
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

      ...(isProductionEnv
        ? [
          // Extracts CSS into separate files
          new MiniCssExtractPlugin({
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
            fix: true,
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
