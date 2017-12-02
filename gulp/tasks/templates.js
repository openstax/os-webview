const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function templates() {
    return gulp.src(`${config.src}/app/**/*.html`, {
        since: gulp.lastRun('templates')
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
    .pipe(pi.sourcemaps.write('.'))
    .pipe(gulp.dest(`${config.dest}/app`));
}

gulp.task(templates);

gulp.task('templates:watch', () => {
    gulp.watch(`${config.src}/**/*.html`, config.watchOpts)
    .on('change', gulp.series(
        templates,
        'reload-browser'
    ));
});
