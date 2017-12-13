const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();
const path = require('path');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');


function webpack() {
    const isDevelopment = config.env === 'development'
    const plugins = isDevelopment ?
        [new HardSourceWebpackPlugin()] :
        [
            new webpack2.optimize.UglifyJsPlugin({ sourceMap: true }),
            new webpack2.optimize.MinChunkSizePlugin({minChunkSize: 16000}),
        ];

    return gulp.src([
        `${config.dest}/app/main.js`
    ]).pipe(webpackStream({
      // watch: true, // This causes gulp to freeze and not serve
      externals: {
          settings: 'SETTINGS'
      },
      output: {
        path: path.resolve(config.dest),
        filename: "bundle.js",
        publicPath: "/", // for where to request chunks when the SinglePageApp changes the URL
        chunkFilename: "chunk-[chunkhash].js"
      },
      plugins,
      resolve: {
        alias: {
          "settings": path.resolve(config.dest, "settings.js"),
          "~": path.resolve(config.dest, "app/"),
        }
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            use: ["source-map-loader"],
            enforce: "pre"
          },
          {
              test: /\.css$/,
              loader: 'ignore-loader'
          },
          {
              test: /\.map$/,
              loader: 'ignore-loader'
          }
        ]
      },
      devtool: "source-map"
    }))
    // .pipe(pi.sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest));
}

gulp.task(webpack);
