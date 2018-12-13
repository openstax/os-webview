const {series, parallel, task} = require('gulp');
const allTheThings = require('require-dir')('./gulp/tasks');
const {
    clean, copy, development, production, favicon, html, scsslint, styles,
    humans, images, eslint, scripts, settings, precache, templates, webpack,
    watch, webpackDll
} = Object.assign({}, ...Object.values(allTheThings));

const beforeWebpack = series(
    clean,
    parallel(
        copy,
        series(favicon, html),
        styles,
        scripts,
        templates,
        images
    )
);
const defaultBuild = series(beforeWebpack, webpackDll, webpack);

module.exports = {
    default: defaultBuild,
    dev: series(
        development,
        beforeWebpack,
        settings,
        parallel(
            watch,
            webpack
        )
    ),
    lint: parallel(scsslint, eslint),
    dist: series(
        production,
        defaultBuild,
        precache,
        humans
    ),
    webpackDll: series(development, webpackDll)
};
