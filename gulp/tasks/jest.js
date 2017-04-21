const gulp = require('gulp');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

gulp.task('jest', function () {
    return gulp.src('test/src/**', {
        since: gulp.lastRun('jest')
    }).pipe(pi.jest());
});
