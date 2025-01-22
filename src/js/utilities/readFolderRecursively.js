'use strict';

const fs = require("fs");
const path = require("path");

const readFolderRecursively = (folder, relativeFilePathArray) => {
  fs.readdirSync(folder).forEach((file) => {
    const filePath = folder + path.sep + file;
    if (fs.statSync(filePath).isDirectory()) {
      relativeFilePathArray = readFolderRecursively(filePath, relativeFilePathArray);
    } else {
      // relativeFilePathArray.push(path.join(folder, path.sep, file));
      relativeFilePathArray.push(filePath);
    }
  });
  return relativeFilePathArray;
};

module.exports = readFolderRecursively;
