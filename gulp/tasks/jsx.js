const path = require('path');
const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function jsx() {
    const configSrcApp = `${config.src}/app`;
    const configDestApp = `${config.dest}/app`;

    return gulp.src(`${configSrcApp}/**/*.jsx`, {
        since: gulp.lastRun(jsx)
    })
    .pipe(pi.sourcemaps.init({loadMaps: true}))
    .pipe(pi.rename((uri) => {
        uri.extname = '.jsx.js';
    }))
    .pipe(pi.babel({
        compact: false,
        presets: ['@babel/preset-react']
    }))
    // prefix the sourcemaps with '../src/' so webpack can find them
    .pipe(pi.sourcemaps.mapSources(function(sourcePath, file) {
      const sourcePathHtml = sourcePath.replace('.jsx.js', '.jsx');
      const rel = path.relative(path.dirname(`${configDestApp}/${sourcePath}`), `${configSrcApp}/${sourcePathHtml}`)
      return rel;
    }))
    .pipe(pi.sourcemaps.write('.'))
    .pipe(gulp.dest(`${configDestApp}`));
}


function watchJsx() {
    gulp.watch([`${config.src}/**/*.jsx`], config.watchOpts, gulp.series(
        jsx
    ));
}

exports.jsx = jsx;
exports.jsx.watch = watchJsx;
