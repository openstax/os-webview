const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();
const path = require('path');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');

function webpack() {
    // Don't move this outside -- env gets set after load-time
    const isDevelopment = config.env === 'development';
    const output = {
        path: path.resolve(config.dest),
        filename: "bundle.js",
        publicPath: "/", // for where to request chunks when the SinglePageApp changes the URL
        chunkFilename: "chunk-[chunkhash].js"
    };
    const webpackConfig = {
        externals: {
            settings: 'SETTINGS'
        },
        entry: path.resolve(config.dest, "app/main.js"),
        mode: config.env,
        watch: isDevelopment,
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
                    loader: 'source-map-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.map$/,
                    loader: 'ignore-loader'
                }
            ]
        },
        devtool: 'source-map'
    };

    if (isDevelopment) {
        delete output.chunkFilename;
    }

    return gulp.src([
        `${config.dest}/app/main.js`
    ])
    .pipe(webpackStream(webpackConfig, webpack2))
    .pipe(gulp.dest(config.dest));
}

gulp.task(webpack);

gulp.task('webpack:watch', () => {
    gulp.watch(`${config.dest}/**/*.bundle.js.map`, gulp.series('reload-browser'));
});
