'use strict';

const path = require("path");

const readFolderRecursively = require("./readFolderRecursively");

const getEjsViewConfigs = (folder, { templatePath }) => {
  const relativeFilePathArray = readFolderRecursively(folder, []);
  // return { folder, templatePath, relativeFilePathArray };
  return relativeFilePathArray
    .filter(file => file.endsWith('.ejs'))
    .map(file =>
      file
        .replace(`${folder}${path.sep}`, '')
        // .replace(/\\g/, '/')
        .replace('.ejs', ''))
    .map(relativeFilePath => {
      const filename = relativeFilePath.split('/').pop();
      let title = filename.replaceAll('-', ' ').toLowerCase().replace(/\b[a-z]/g, function (s) {
        // help link: https://stackoverflow.com/a/63802499
        return s.toUpperCase();
      });
      if (filename === 'index') {
        title = 'MyJobDone';
      }
      return {
        filename: `./${relativeFilePath}.html`,
        template: templatePath,
        templateParameters: {
          'title': title,
          'page': relativeFilePath,
        },
      };
    });
};

module.exports = getEjsViewConfigs;
