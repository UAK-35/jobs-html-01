import path from 'path';
import webpack from 'webpack';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

import autoprefixer from 'autoprefixer';
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import { InjectManifest } from 'workbox-webpack-plugin';
// import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { getEjsViewConfigs, getPublicUrlOrPath } from "./src/ts/utils/helpers";
import Constants from "./src/ts/lib/constants";
import { ErrorInfo } from "ts-loader/dist/interfaces";

// console.log('NODE_ENV', Constants.envValues.envMode);

// Get the script name, how was webpack process started, start or build
const currentNpmScriptTask = process.env.npm_lifecycle_event;
console.log('current npm script', currentNpmScriptTask);

const config = (webpackEnv: any, _argv: any): webpack.Configuration => {
  console.log('webpackEnv', webpackEnv);
  // console.log('webpack NODE_ENV', webpackEnv.NODE_ENV);

  // const envMode = webpackEnv.NODE_ENV; // does not work
  console.log('envMode', Constants.envValues.envMode);

  const isDevelopmentEnv = Constants.envValues.isDevelopmentEnv;
  const isStagingEnv = Constants.envValues.isStagingEnv;
  const isProductionEnv = Constants.envValues.isProductionEnv;
  const webPackMode = Constants.envValues.webPackMode;

  // const envFile = `.env${isProductionEnv ? "" : "." + envMode}`;
  const envFile = `${Constants.otherValues.envFilePrefix}.${Constants.envValues.envMode}`;
  console.info("environment file = " + envFile);

  const { parsed: parsedEnv } = require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });
  // console.log('parsedEnv', parsedEnv);

  // const publicUrl = process.env.PUBLIC_URL;
  const publicUrl = parsedEnv.PUBLIC_URL;
  // console.log('PUBLIC_URL', publicUrl);

  // set whether are creating source maps with prod builds
  const genSourceMaps = false;

  // get PUBLIC_URL, which is needed for production builds where process (which is a Node server var), doesn't exist
  const publicUrlOrPath = getPublicUrlOrPath(isDevelopmentEnv, undefined, publicUrl);
  // console.log('publicUrlOrPath', publicUrlOrPath);

  const PATH = Constants.folderPaths;
  console.log('PATH', PATH);

  // EJS related
  const perPageViewConfigs = getEjsViewConfigs(PATH.ejsPages, { templatePath: `${Constants.folderPaths.ejsLayoutLoaders}/${Constants.fileNames.templateLoaderFileName}`.replace(/\\/g, '/') });
  // console.log('getEjsViewConfigs', perPageViewConfigs);

  console.log('__dirname', __dirname);

  return {
    mode: webPackMode,
    target: ['browserslist'],
    cache: isProductionEnv ? {
      type: 'filesystem',
      name: `${Constants.appValues.name}-${Constants.envValues.envMode}-BuildCache`,
      profile: false,
      cacheDirectory: path.resolve(__dirname, Constants.relativeFolderPaths.webpackCacheFolder),
      compression: 'gzip',
      hashAlgorithm: 'md4',
      maxAge: 5184000000,
      maxMemoryGenerations: 100,
      memoryCacheUnaffected: true,
      store: 'pack',
      readonly: false,
      // version: '1.0.0',
    } : {
      type: 'memory',
      cacheUnaffected: true,
      maxGenerations: 1,
    },
    snapshot: {
      // managedPaths: [/^(.+?[\\/]node_modules[\\/](?!(@azure[\\/]msal-browser))(@.+?[\\/])?.+?)[\\/]/,],
      managedPaths: [ PATH.npmPackages ],
    },
    infrastructureLogging: { level: 'error' },
    // stats: 'normal',
    stats: {
      builtAt: true,
      colors: true,
      entrypoints: true,
      modules: true,
      optimizationBailout: true,
      outputPath: true,
      publicPath: true,
      performance: true,
      timings: true,
      version: true,
      hash: true,
      ids: true,
      env: true,
      errorsCount: true,
      errors: true,
      errorStack: true,
      errorDetails: true,
      warnings: false,

      // loggingDebug: /FileSystemInfo/,

      // assets: false,
      assetsSort: 'size',
      cachedAssets: true,
      cachedModules: true,

      // chunks: false,
      chunkGroups: true,
      chunkModules: true,
      chunkOrigins: true,
      chunksSort: 'size',
    },
    devtool: isProductionEnv && genSourceMaps ? 'source-map' : isDevelopmentEnv ? 'inline-source-map' : false, // https://webpack.js.org/configuration/devtool/
    externals: {
      path: PATH,
    },

    // context: PATH.src,
    entry: {
      app: `${ Constants.folderPaths.typescript }/${Constants.fileNames.entryFileName}`,
      // app: `${ PATH.src }/js/app.js`,
    },
    // entry: pages.reduce((configAccumulator, page) => {
    //   // configAccumulator[page] = `./${PATH.src}/js/${page}.js`;
    //   configAccumulator[page] = `./${PATH.src}/ts/${page}.ts`;
    //   return configAccumulator;
    // }, {}),

    output: {
      path: PATH.dist,
      publicPath: publicUrlOrPath,
      filename: `js/[name].js`,
      assetModuleFilename: (pathData: webpack.PathData) => {
        if (pathData.filename != null) {
          // help link: https://stackoverflow.com/a/68902490
          const assetFolderPath = path.dirname(pathData.filename).split("/").slice(1).join("/");
          return `${assetFolderPath}/[name][ext][query]`;
        }
        return "";
      },
      clean: true, // clears the output dist folder prior to building

      // Point sourcemap entries to original disk location (format as URL on Windows)
      // devtoolModuleFilenameTemplate: (info: any) => {
      //   console.log('info.absoluteResourcePath', info.absoluteResourcePath);
      //   return info.absoluteResourcePath;
      //   // if (isProductionEnv) return path.relative('./src', info.absoluteResourcePath).replace(/\\/g, '/')
      //   // else return Constants.resolvePath(info.absoluteResourcePath).replace(/\\/g, '/')
      // }
    }, // output

    resolve: {
      modules: [PATH.npmPackages, PATH.src],
      extensions: ['.js', '.ts', '.ejs', '.json', '.scss'],
      // alias: {
      //   // "@": PATH.src,
      //   "@icons": PATH.assets + "/images/icons",
      // },
      fallback: {
        "fs": false,
        "url": false,
      },
    }, // resolve

    devServer: {
      // contentBase: '/dist',
      static: ['./src/'],
      // static: [ PATH.public ],
      host: 'localhost',
      port: 8080,
      liveReload: true,
      open: true,
      hot: true,
      // historyApiFallback: true,
      // historyApiFallback: {
      //   index:'index.html',
      //   rewrites: [
      //     { from: /list\/*/, to: 'index.html' }
      //   ]
      // },
      // https: false,
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
      },
      // watchFiles: {
      //   paths: [
      //     'src/ts/**/*.ts',
      //     'src/views/**/*.ejs'
      //   ],
      //   // Enables live reload in these folders
      //   options: {
      //     usePolling: true
      //   }
      // },
      watchFiles: ["./src/**/*.{ejs,js,ts}"],
      // content: ["./src/**/*.{ejs,js,ts}"],
    }, // devServer
    watchOptions: {
      ignored: /node_modules/,
      followSymlinks: false,
      stdin: true,
      // aggregateTimeout: 10000,
      // poll: 5000
    },

    module: {
      rules: [
        // {
        //   test: /\.ejs$/,
        //   loader: require.resolve('ejs-loader'),
        //   options: {
        //     esModule: false,
        //   },
        // },

        // {
        //   test: /\.ejs$/,
        //   use: [
        //     {
        //       loader: require.resolve('html-loader'),
        //       options: {
        //         // esModule: false,
        //         sources: {
        //           urlFilter: (attribute, value, _resourcePath) => {
        //             console.log('value', attribute, value, _resourcePath);
        //             return !(attribute === "content" || value === "./css/app.css" || value === "./site.webmanifest" || value === "./js/app.js");
        //           },
        //         },
        //         preprocessor: (content, loaderContext) => {
        //           console.log('content', content);
        //           return content;
        //         },
        //       },
        //     },
        //   ]
        // },

        // {
        //   test: /\.ejs$/i,
        //   loader: 'html-loader',
        //   options: {
        //     preprocessor: (content, loaderContext) => {
        //       try {
        //         const templatePath = path.resolve(__dirname, './src/index.ejs');
        //
        //         // trigger re-compile if partial has changed
        //         // see: https://github.com/webpack-contrib/html-loader/issues/386
        //         const partialsPath = path.resolve(__dirname, './src/partials');
        //         fs.readdirSync(partialsPath).forEach((file) => {
        //           if (file.endsWith('.ejs')) {
        //             const filePath = `${partialsPath}/${file}`;
        //             loaderContext.addDependency(filePath);
        //           }
        //         });
        //
        //         const templateParameters = {
        //           // ... add your data here
        //         };
        //
        //         // OPTIONAL: expose htmlWebpackPlugin object in EJS templates
        //         const currentHtmlWebpackPlugin = loaderContext._compiler.options.plugins.filter(
        //           (plugin) =>
        //             typeof plugin === 'object' &&
        //             plugin.options &&
        //             plugin.options.template &&
        //             plugin.options.template === loaderContext.resourcePath,
        //         )[0];
        //
        //         if (typeof currentHtmlWebpackPlugin === 'object') {
        //           Object.assign(templateParameters, {
        //             htmlWebpackPlugin: currentHtmlWebpackPlugin,
        //           });
        //
        //           if (typeof currentHtmlWebpackPlugin.options.templateParameters !== 'function') {
        //             Object.assign(templateParameters, {
        //               ...currentHtmlWebpackPlugin.options.templateParameters,
        //             });
        //           }
        //         }
        //
        //         return ejs.render(content, templateParameters, { filename: templatePath });
        //       } catch (error) {
        //         loaderContext.emitError(error);
        //
        //         return content;
        //       }
        //     },
        //   },
        // },

        // {
        //   test: /\.js$/,
        //   exclude: /node_modules/,
        //   use: [
        //     {
        //       loader: require.resolve('babel-loader'),
        //       // options: {
        //       //   presets: ['@babel/env'],
        //       //   plugins: ['@babel/plugin-proposal-class-properties'],
        //       // },
        //     }
        //   ],
        // },

        {
          test: /\.(scss)$/,
          use: [
            isProductionEnv ?

              // In production mode, MiniCSSExtractPlugin extract CSS to file(s), but in development "style" loader enables hot editing of CSS.
              MiniCssExtractPlugin.loader :

              // In development mode, style loader turns CSS into JS modules that injects <style> tags
              // Adds CSS to the DOM by injecting one/multiple `<style>` tags
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
              loader: require.resolve('sass-loader'),
              options: {
                sassOptions: {
                  sourceMap: genSourceMaps,
                  implementation: require.resolve('sass'),
                  mode: webPackMode,
                  webpackImporter: false,

                  api: 'modern',
                  silenceDeprecations: ['import', 'global-builtin', 'mixed-decls'],
                  // verbose: true,
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
          options: {
            // errorFormatter: (error: any, colors: any) => {
            //   // console.log('__dirname', __dirname);
            //   const messageColor =
            //     error.severity === "warning" ? colors.bold.yellow : colors.bold.red;
            //   return (
            //     "Does not compute.... " +
            //     messageColor(Object.keys(error).map(key => `${key}: ${error[key]}`))
            //   );
            // },
            transpileOnly: false,
            // configFile: `${PATH.base}./tsconfig.json`,
            // context: PATH.base,
            // configFile: require.resolve('tsconfig.json'),
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            compiler: 'typescript',
            logLevel: 'info',
            silent: false,
            colors: false,
            useCaseSensitiveFileNames: true,
            experimentalFileCaching: true,
          },
          // use: [
          //   {
          //     loader: require.resolve('ts-loader'),
          //     options: {
          //       // transpileOnly: true
          //       configFile: './tsconfig.json',
          //       configFile: `${PATH.base}./tsconfig.json`,
          //     }
          //   }
          // ]
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
                  urlFilter: (attribute: string, value: string, _resourcePath: string) => {
                    // console.log('value', attribute, value, resourcePath);
                    return !(attribute === "content" || value === "./css/app.css" || value === "./site.webmanifest" || value === "./js/app.js");
                  },
                }
              },
            },
          ]
        },

        {
          mimetype: 'image/svg+xml',
          scheme: 'data',
          type: 'asset/resource',
          generator: {
            filename: 'bs-icons/[hash].svg'
          }
        },

        {
          test: /\.(webp|png|svg|jpg|jpeg|gif|ico)$/i,
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
        //   loader: require.resolve('tslint-loader'),
        //   exclude: /node_modules/
        // }
      ], // rules
    }, // module

    plugins: [
      // Makes environment variables available to the build code
      new webpack.DefinePlugin({
        'PUBLIC_URL': JSON.stringify(publicUrlOrPath),
        'WEBPACK_MODE': JSON.stringify(webPackMode),
        'process.env': {
          NODE_ENV: JSON.stringify(Constants.envValues.envMode),
        },
      }),

      // Generates an `index.html` file with the <script> injected or otherwise
      // new HtmlWebpackPlugin(Object.assign({}, defaultHtmlWebpackPluginConfig, {
      //   // template: `${PATH.src}/index.html`, // template file
      //   // filename: 'index.html', // output file
      //
      //   // template: `${PATH.assets}/layouts/template.js`, // template file
      //   template: `${PATH.src}/ts/ejs/layoutLoaders/template.ts`, // template file
      //   templateParameters: {
      //     'title': "MyJobDone",
      //     'page': "index",
      //     viewsFolder: PATH.views.replace(/\\/g, '/'),
      //   },
      //   filename: 'index.html', // output file
      // })),

      // Generates an `.html` file for each of EJS views
      ...perPageViewConfigs.map(cfg => {
        if (cfg == null) return null;
        return new HtmlWebpackPlugin(Object.assign({}, Constants.defaultHtmlWebpackPluginConfig, {
          ...cfg,
          templateParameters: {
            ...cfg.templateParameters, // title, page
            viewsFolder: PATH.views.replace(/\\/g, '/'),
            partialsFolder: PATH.ejsPartials.replace(/\\/g, '/'),
          },
        }));
      }).filter(Boolean),

      // Copies the public directory into the root of build directory
      // new CopyWebpackPlugin({ patterns: [{ from: 'public' }] }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${PATH.assets}/images`,
            to: './assets/images'
          }
        ]
      }),

      ...(isProductionEnv
        ? [
          // Extracts CSS into separate files
          new MiniCssExtractPlugin({
            filename: (pathData: webpack.PathData) => `css/[name].css`, // help link: https://stackoverflow.com/a/52895274
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
            cacheLocation: Constants.relativeFolderPaths.eslintCacheFolder,
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
            },
            compress: {
              drop_console: true,
            }
          }
        }),

        // minimise CSS
        new CssMinimizerPlugin(),
      ],

      usedExports: true,
      splitChunks: {
        chunks: "all",
      }
    } // optimization

  } // return
};

export default config;

// npm i -D @types/node @types/webpack @types/webpack-dev-server ts-node tsconfig-paths
