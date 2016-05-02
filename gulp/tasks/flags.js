var gulp = require('gulp');
var argv = require('yargs').argv;
var pi = require('gulp-load-plugins')();

function flags() {
    var env = process.env.NODE_ENV;

    if (argv.production) {
        env = 'production';
    } else if (argv.development) {
        env = 'development';
    }

    pi.env({
        vars: {
            NODE_ENV: env
        }
    });

    return Promise.resolve();
}

gulp.task(flags);
