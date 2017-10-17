const gulp = require('gulp');
const rollup = require('rollup-stream');
const sourcemaps = require('gulp-sourcemaps');
//const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('../config');
const rollupConfig = require('../../rollup.config');


gulp.task('rollup', function() {
  return rollup(rollupConfig)

    // point to the entry file.
    .pipe(source('main.js', './src/app/'))

    // buffer the output. most gulp plugins, including gulp-sourcemaps, don't support streams.
    .pipe(buffer())

    // tell gulp-sourcemaps to load the inline sourcemap produced by rollup-stream.
    .pipe(sourcemaps.init({loadMaps: true}))

        // transform the code further here.

    // if you want to output with a different name from the input file, use gulp-rename here.
    //.pipe(rename('index.js'))

    // write the sourcemap alongside the output file.
    .pipe(sourcemaps.write('.'))

    // and output to ./dist/main.js as normal.
    .pipe(gulp.dest(config.dest)); // was ./dist/
});
