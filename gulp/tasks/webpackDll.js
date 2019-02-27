const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const pi = require('gulp-load-plugins')();
const webpackStream = require('piped-webpack');

function webpackDll() {
    const webpackConfig = {
        context: process.cwd(),
        mode: 'production',
        entry: {
            babel: [
                'babel-polyfill',
                'babel-runtime/helpers/asyncToGenerator',
                'babel-runtime/helpers/classCallCheck',
                'babel-runtime/helpers/createClass',
                'babel-runtime/helpers/get',
                'babel-runtime/helpers/inherits',
                'babel-runtime/helpers/possibleConstructorReturn',
                'babel-runtime/regenerator',
                'babel-runtime/helpers/slicedToArray',
                'babel-runtime/helpers/toConsumableArray',
                'babel-runtime/helpers/typeof'
            ],
            library: [
                'incremental-dom',
                'lodash',
                'particles.js/particles',
                'recordo'
            ],
            mapbox: [
                'mapbox-gl',
            ]
        },
        output: {
            filename: '[name].dll.js',
            path: path.resolve(config.dest, '..'),
            library: '[name]'
        },
        plugins: [
            new webpack.DllPlugin({
                name: '[name]',
                path: path.resolve(config.dest, '../[name].json')
            })
        ]
    };
    return gulp.src([
        path.resolve(__dirname, 'node_modules/recordo/dist/*.js')
    ])
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(config.dest));

}

module.exports.webpackDll = webpackDll;
