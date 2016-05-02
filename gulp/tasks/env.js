var gulp = require('gulp');
var pi = require('gulp-load-plugins')();

function nodeEnv(env) {
    pi.env({
        vars: {
            NODE_ENV: env
        }
    });

    return Promise.resolve();
}

function development() {
    return nodeEnv('development');
}

function production() {
    return nodeEnv('production');
}

gulp.task(development);
gulp.task(production);
