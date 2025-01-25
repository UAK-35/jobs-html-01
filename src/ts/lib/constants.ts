import path from "path";

class Constants {
  private static readonly envMode = process.env.NODE_ENV;
  private static readonly isDevelopmentEnv = Constants.envMode === 'development';
  private static readonly isStagingEnv = Constants.envMode === 'staging';
  private static readonly isProductionEnv = Constants.isStagingEnv || Constants.envMode === 'production';
  private static readonly webPackMode: "production" | "development" | "none" | undefined = Constants.isProductionEnv ? 'production' : 'development';
  private static readonly currentFolder = path.resolve(__dirname, "../../../"); // setup path for root folder

  static readonly envValues = {
    envMode: Constants.envMode,
    isDevelopmentEnv: Constants.isDevelopmentEnv,
    isStagingEnv: Constants.isStagingEnv,
    isProductionEnv: Constants.isProductionEnv,
    webPackMode: Constants.webPackMode,
  };

  static readonly appValues = {
    name: "MyJobDone",
  };

  static readonly otherValues = {
    envFilePrefix: '.env',
  };

  static readonly runningEnvironmentNames = {
    production: 'production',
    development: 'development',
    staging: 'staging',
    test: 'test',
  };

  static readonly folderPaths = {
    base: Constants.currentFolder,
    src: Constants.resolvePath("src"),
    dist: Constants.resolvePath("dist"),
    public: Constants.resolvePath("public"),
    assets: Constants.resolvePath('src/assets'),
    views: Constants.resolvePath("src/views"),
    npmPackages: Constants.resolvePath("node_modules"),
    styles: Constants.resolvePath('src/scss'),
    ejsLayoutLoaders: Constants.resolvePath('src/ts/ejs/layoutLoaders'),
    ejsPages: Constants.resolvePath('src/views/pages'),
    ejsPartials: Constants.resolvePath('src/views/partials'),
    typescript: Constants.resolvePath('src/ts'),
  };

  static readonly relativeFolderPaths = {
    webpackCacheFolder: '.cache/webpack',
    eslintCacheFolder: ".cache/eslint-webpack-plugin/.eslintcache",
  };

  static readonly fileNames = {
    entryFileName: 'app.ts',
    templateLoaderFileName: "template.ts",
  };

  // utility class constructor
  private constructor() {
  }

  static get defaultHtmlWebpackPluginConfig() {
    // EJS/html related
    return {
      hash: false,
      inject: true,
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    };
  }

  static resolvePath(pathString: string) {
    return path.resolve(Constants.currentFolder, pathString);
  }


}

export default Constants;
