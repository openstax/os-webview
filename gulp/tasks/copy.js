var gulp = require('gulp');
var config = require('../config');

function copy() {
    var systemjs, polyfilljs;

    if (config.env === 'production') {
        systemjs = 'jspm_packages/system.js';
    } else {
        systemjs = 'jspm_packages/system.js*';
    }

    polyfilljs = 'jspm_packages/system-polyfills.js';

    return gulp.src([
        `${config.src}/*.{json,txt,ico}`,
        systemjs,
        polyfilljs
    ])
    .pipe(gulp.dest(config.dest));
}

gulp.task(copy);

gulp.task('copy:watch', () => {
    gulp.watch(`${config.src}/*.{json,txt,ico}`, copy);
});
