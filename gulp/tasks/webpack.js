const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();
const path = require('path');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');


function webpack() {
    const isDevelopment = config.env === 'development'
    const output = {
        path: path.resolve(config.dest),
        filename: "bundle.js",
        publicPath: "/", // for where to request chunks when the SinglePageApp changes the URL
        chunkFilename: "chunk-[chunkhash].js"
    };

    if (isDevelopment) {
        delete output.chunkFilename;
    }

    return gulp.src([
        `${config.dest}/app/main.js`
    ]).pipe(webpackStream({
        externals: {
            settings: 'SETTINGS'
        },
        mode: isDevelopment ? 'development' : 'production',
        output,
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
                    exclude: /node_modules/,
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
    }, webpack2))
    .pipe(gulp.dest(config.dest));
}

gulp.task(webpack);
