const path = require('path');

// from https://webpack.js.org/configuration/
module.exports = {
  entry: "./dist/app/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // for where to request chunks when the SinglePageApp changes the URL
    chunkFilename: "chunk-[chunkhash].js"
  },
  resolve: {
    alias: {
      "settings": path.resolve(__dirname, "dist/settings.js"),
      "~": path.resolve(__dirname, "./dist/app"),
    }
  },
  devtool: "sourcemap"
}
