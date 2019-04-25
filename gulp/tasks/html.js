const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')();
const rev = require('gulp-rev')

const replaceURLs = (mapping) => {
    let transform = gulp.src(`${config.src}/*.html`)
    Object.keys(mapping).forEach((replacement) => {
        transform = transform.pipe(
            pi.replace(
                new RegExp(`@${replacement}_URL@`, "g"),
                mapping[replacement],
            )
        )
    })
    return transform.pipe(gulp.dest(config.dest));
}

function hashFile(directory, name) {
    return () =>
        gulp.src(`${config.dest}/${directory}/${name}`)
            .pipe(rev())
            .pipe(gulp.dest(`${config.dest}/${directory}`))
            .pipe(rev.manifest({
                path: `${config.dest}/rev-manifest.json`,
                base: `${config.dest}/${directory}`,
                merge: true,
            }))
            .pipe(gulp.dest(`${config.dest}/${directory}`))
}

// Don't need to do anything fancy in development, just replace the filename
function devHTML() {
    return replaceURLs({
        BUNDLE:   '/scripts/bundle.js',
        STYLES:   '/styles/main.css',
        SETTINGS: '/settings.js',
    })
}
function watchHtml() {
    gulp.watch(`${config.src}/*.html`, config.watchOpts)
        .on('change', devHTML);
}
exports.devHTML = devHTML
exports.devHTML.watch = watchHtml

// when building production distribution files,
// include the file's SHA in the filenamnes
function distHTML(distDone) {
    return gulp.series(
        hashFile('scripts', 'bundle.js'),     // while it might seem like this could be "parallel",
        hashFile('styles', 'main.css'),  // mangled when multiple writers access it
        () => {
            const revManifest = require(`../../${config.dest}/rev-manifest.json`);
            return replaceURLs({
                STYLES:   `${config.urlPrefix}/styles/${revManifest['main.css']}`,
                BUNDLE:   `${config.urlPrefix}/scripts/${revManifest['bundle.js']}`,
                SETTINGS: `${config.urlPrefix}/settings.js?${config.version}`,
            })
        }
    )(distDone)
}
exports.distHTML = distHTML
