const path = require('path');
const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function templates() {
    const configSrcApp = `${config.src}/app`;
    const configDestApp = `${config.dest}/app`;

    return gulp.src(`${configSrcApp}/**/*.html`, {
        since: gulp.lastRun(templates)
    })
    .pipe(pi.sourcemaps.init({loadMaps: true}))
    .pipe(pi.rename((uri) => {
        uri.extname = '.html.js';
    }))
    .pipe(pi.htmlmin({
        collapseWhitespace: true
    }))
    .pipe(pi.superviewsjs({
        mode: 'es6'
    }))
    .pipe(pi.babel({
        compact: false,
        presets: ['es2015']
    }))
    // prefix the sourcemaps with with '../src/' so webpack can find them
    .pipe(pi.sourcemaps.mapSources(function(sourcePath, file) {
      const sourcePathHtml = sourcePath.replace('.html.js', '.html');
      const rel = path.relative(path.dirname(`${configDestApp}/${sourcePath}`), `${configSrcApp}/${sourcePathHtml}`)
      return rel;
    }))
    .pipe(pi.sourcemaps.write('.'))
    .pipe(gulp.dest(`${configDestApp}`));
}

function watchTemplates() {
    gulp.watch(`${config.src}/**/*.html`, templates);
}

exports.templates = templates;
exports.templates.watch = watchTemplates;
