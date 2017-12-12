const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();
const path = require('path');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');

function webpack() {
    return gulp.src([
        `${config.dest}/app/main.js`
    ])
    .pipe(webpackStream({
        // watch: true, // This causes gulp to freeze and not serve
        output: {
            path: path.resolve(config.dest),
            filename: "bundle.js",
            publicPath: "/", // for where to request chunks when the SinglePageApp changes the URL
            chunkFilename: "chunk-[chunkhash].js"
        },
        externals: {
            settings: 'SETTINGS'
        },
        module: {
            rules: [
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
        plugins: [
            new webpack2.optimize.UglifyJsPlugin(),
            new webpack2.optimize.MinChunkSizePlugin({minChunkSize: 16000})
        ],
        resolve: {
            alias: {
                "settings": path.resolve(config.dest, "settings.js"),
                "~": path.resolve(config.dest, "app/"),
            }
        },
        devtool: "source-map"
    }))
    .pipe(pi.sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest));
}

gulp.task(webpack);
