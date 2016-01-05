var gulp = require('gulp');
var config = require('../config');
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

gulp.task('clean', () => {
    var stream = pi.del([config.dest], {
        dot: true
    });

    return stream;
});
