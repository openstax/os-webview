const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();
const path = require('path');
const webpackStream = require('piped-webpack');
const bs = require('./browser-sync');
const dlls = ['babel', 'library', 'mapbox'];
const {DllReferencePlugin} = require('webpack');

function webpack() {
    // Don't move this outside -- env gets set after load-time
    const isDevelopment = config.env === 'development';
    const output = {
        path: path.resolve(config.dest, '..'),
        filename: "bundle.js",
        publicPath: "/", // for where to request chunks when the SinglePageApp changes the URL
        chunkFilename: "chunk-[chunkhash].js"
    };
    const webpackConfig = {
        externals: {
            settings: 'SETTINGS'
        },
        mode: config.env,
        watch: isDevelopment,
        watchOptions: {
            aggregateTimeout: 8000
        },
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
                    loader: 'source-map-loader',
                    exclude: [
                        /node_modules/
                    ]
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
        devtool: 'source-map',
        plugins: [
            ...dlls.map((name) => new DllReferencePlugin({
                context: process.cwd(),
                manifest: path.resolve(config.dest, `./${name}.json`)
            }))
        ]
    };

    if (isDevelopment) {
        delete output.chunkFilename;
    }

    return gulp.src([
        `${config.dest}/app/main.js`
    ])
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(config.dest));
}

function loadOrReload(done) {
    if (!loadOrReload.done) {
        loadOrReload.done = true;
        bs['browser-sync']();
    }
    bs['reload-browser'](done);
}

function watchWebpack() {
    gulp.watch(`${config.dest}/**/*.bundle.js.map`, loadOrReload);
}

exports.webpack = webpack;
exports.webpack.watch = watchWebpack;
