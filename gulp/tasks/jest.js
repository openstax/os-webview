const gulp = require('gulp');
const gutil = require('gulp-util');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

// Be quiet!
gutil.log = gutil.noop;
gulp.task('jest', function () {
    return gulp.src('test/src/**', {
        since: gulp.lastRun('jest')
    }).pipe(pi.jest());
});
