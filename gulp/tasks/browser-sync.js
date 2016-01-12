var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').create(config.name);
var historyApiFallback = require('connect-history-api-fallback');

function browserSync() {
    bs.init({
        server: {
            baseDir: `./${config.dest}`,
            middleware: [historyApiFallback()]
        }
    });
    return Promise.resolve();
}

gulp.task('browser-sync', browserSync);
