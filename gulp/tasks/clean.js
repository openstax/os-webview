var gulp = require('gulp');
var config = require('../config');
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

gulp.task('clean', () => {
    return pi.del([config.dest], {dot: true});
});
