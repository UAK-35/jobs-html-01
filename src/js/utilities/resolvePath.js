'use strict';

const path = require("path");

const resolvePath = (pathString) => {
  return path.resolve(__dirname, pathString);
}

module.exports = resolvePath;
