var gulp = require('gulp');
var pi = require('gulp-load-plugins')();

function development() {
    pi.env({
        vars: {
            NODE_ENV: 'development'
        }
    });

    return Promise.resolve();
}

gulp.task(development);
