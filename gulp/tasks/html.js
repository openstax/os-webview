const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();

function html() {
    return gulp.src(`${config.dest}/*.html`, {
        since: gulp.lastRun('html')
    })
    .pipe(pi.if(config.env === 'production', pi.htmlmin({
        collapseWhitespace: true
    })))
    .pipe(pi.replace(/@VERSION@/g, config.version))
    .pipe(gulp.dest(config.dest));
}

gulp.task(html);

gulp.task('html:watch', () => {
    gulp.watch(`${config.dest}/*.html`, config.watchOpts)
    .on('change', gulp.series(
        html,
        'reload-browser'
    ));
});
