const gulp = require('gulp');
const pi = require('gulp-load-plugins')();

function nodeEnv(env) {
    pi.env({
        vars: {
            NODE_ENV: env
        }
    });
}

function development(done) {
    nodeEnv('development');
    done();
}

function production(done) {
    nodeEnv('production');
    done();
}

gulp.task(development);
gulp.task(production);
