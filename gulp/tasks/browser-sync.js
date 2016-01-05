var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').create(config.name);

function browserSync() {
    bs.init({
        server: `./${config.dest}`
    });
    return Promise.resolve();
}

gulp.task('browser-sync', browserSync);
