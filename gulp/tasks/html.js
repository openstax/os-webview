var gulp = require('gulp');
var config = require('../config');
var pi = require('gulp-load-plugins')();

function html() {
    return gulp.src([`${config.src}/**/*.html`], {
        since: gulp.lastRun('html')
    })
    .pipe(pi.if(config.env === 'production', pi.minifyHtml()))
    .pipe(pi.replace(/@VERSION@/g, config.version))
    .pipe(gulp.dest(config.dest));
}

gulp.task(html);

gulp.task('html:watch', () => {
    gulp.watch(`${config.src}/**/*.html`, html);
});
