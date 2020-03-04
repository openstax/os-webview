const {series, parallel, task} = require('gulp');
const allTheThings = require('require-dir')('./gulp/tasks');
const {
  clean, copy, development, production, favicon, scsslint, styles,
  humans, images, eslint, scripts, settings, precache, templates, jsx, webpack,
  watch, devHTML, distHTML
} = Object.assign({}, ...Object.values(allTheThings));


const beforeWebpack = series(
    clean,
    parallel(
        copy,
        favicon,
        jsx,
        styles,
        scripts,
        templates,
        images
    )
);
const defaultBuild = series(beforeWebpack, webpack);

module.exports = {
    default: series(
        production,
        defaultBuild,
        distHTML,
    ),
    dev: series(
        development,
        beforeWebpack,
        settings,
        devHTML,
        parallel(
            watch,
            webpack
        )
    ),
    lint: parallel(scsslint, eslint),
    dist: series(
        production,
        defaultBuild,
        distHTML,
        precache,
        humans
    )
};
