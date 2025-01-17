class BuildTimePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('Build Time Plugin', (stats) => {
      console.log(('\n[' + new Date().toLocaleString() + ']') + ' --- BUILD DONE.\n');
    });
  }
}

module.exports = BuildTimePlugin;
