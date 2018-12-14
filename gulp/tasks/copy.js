const gulp = require('gulp');
const config = require('../config');

const glob = `${config.src}/**/*.{json,txt,ico,eot,ttf,woff,woff2,xml}`;

function copy() {
    return gulp.src(glob, {
        since: gulp.lastRun(copy)
    })
    .pipe(gulp.dest(config.dest));
}

function watchCopy() {
    gulp.watch(glob, config.watchOpts)
    .on('change', copy);
}

exports.copy = copy;
exports.copy.watch = watchCopy;
