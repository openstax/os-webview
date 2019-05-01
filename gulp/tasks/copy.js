const gulp = require('gulp');
const config = require('../config');
const rename = require('gulp-rename');

const fileGlob = `${config.src}/**/*.{json,txt,ico,xml}`;
const fontGlob = `${config.src}/**/*.{eot,ttf,woff,woff2}`;

function copy(copyDone) {
    return gulp.parallel(
        () => gulp
            .src(fileGlob, { since: gulp.lastRun(copy) })
            .pipe(gulp.dest(config.dest)),
        () => gulp
            .src(fontGlob, { since: gulp.lastRun(copy) })
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(`${config.dest}/${config.urlPrefix}/fonts`))
    )(copyDone)
}

function watchCopy() {
    gulp.watch(fileGlob, config.watchOpts)
    .on('change', copy);
}

exports.copy = copy;
exports.copy.watch = watchCopy;
