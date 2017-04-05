const gulp = require('gulp');

gulp.task('jest', function () {
    return gulp.src('test/src/**', {
        since: gulp.lastRun('jest')
    })
});
