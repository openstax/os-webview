const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();

function html() {
    return gulp.src(`${config.dest}/*.html`, {
        since: gulp.lastRun(html)
    })
    .pipe(pi.replace(/@VERSION@/g, config.version))
    .pipe(gulp.dest(config.dest));
}

function watchHtml() {
    gulp.watch(`${config.dest}/*.html`, config.watchOpts)
    .on('change', html);
}

exports.html = html;
exports.html.watch = watchHtml;
