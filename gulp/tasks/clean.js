const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

gulp.task('clean', () => {
    return pi.del([config.dest], {dot: true});
});
