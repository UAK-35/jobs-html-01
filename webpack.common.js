const path = require('path');
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ESLintPlugin = require('eslint-webpack-plugin');

// module.exports = {
//   entry: {
//     app: './js/app.js',
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     clean: true,
//     filename: './js/app.js',
//   },
// };

module.exports = {
  entry: './src/ts/app.ts',
  output: {
    // publicPath: "/",
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    // assetModuleFilename: "assets/[hash][ext][query]",
    assetModuleFilename: 'assets/[name][ext][query]',
    clean: true
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html', inject: false }),
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
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
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
        // enforce: 'pre',
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
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
      //   type: 'asset/resource',
      // },
      {
        test: /\.(svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: './assets/images/icons/[name][ext]'
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: './assets/images/pics/[name][ext]'
        }
      },
      // {
      //   test: /\.png$/,
      //   type: 'asset/inline'
      // },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          // filename: './images/[name].[hash][ext]'
          filename: './assets/fonts/[name][ext]'
        }
      },
      // {
      //   test: /\.html$/i,
      //   use: [
      //     {
      //       loader: 'html-loader',
      //       options: {
      //         sources: true,
      //         minimize: true,
      //         esModule: true,
      //       },
      //     },
      //   ],
      // },
    ]
  }
}
