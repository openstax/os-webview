var gulp = require('gulp');
var argv = require('yargs').argv;
var config = require('../config');
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function images() {
    return gulp.src(`${config.src}/**/*.{png,jpg,jpeg,gif,svg,mp4}`, {
        since: gulp.lastRun('images')
    })
    .pipe(pi.if(argv.images === 'min', pi.imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 7,
        multipass: true,
        svgoPlugins: [{
            removeViewBox: false
        }]
    })))
    .pipe(gulp.dest(config.dest));
}

gulp.task(images);

gulp.task('images:watch', () => {
    gulp.watch(`${config.src}/**/*.{png,jpg,jpeg,gif,svg,mp4}`, config.watchOpts)
    .on('change', images);
});
