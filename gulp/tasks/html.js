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

function hashFile(name) {
    return () =>
        gulp.src(`${config.dest}/${name}`)
            .pipe(rev())
            .pipe(gulp.dest(config.dest))
            .pipe(rev.manifest({
                path: `${config.dest}/rev-manifest.json`,
                base: config.dest,
                merge: true,
            }))
            .pipe(gulp.dest(config.dest))
}

// Don't need to do anything fancy in development, just replace the filename
function devHTML() {
    return replaceURLs({
        BUNDLE:   '/bundle.js',
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
        hashFile('bundle.js'),   // while it might seem like this could be "parallel", that causes the
        hashFile('settings.js'), // rev-manifest.json file to become mangled when both write to it
        hashFile('styles/main.css'),
        () => {
            const revManifest = require(`../../${config.dest}/rev-manifest.json`);
            return replaceURLs({
                STYLES:   `${config.distUrlPrefix}/styles/${revManifest['main.css']}`,
                BUNDLE:   `${config.distUrlPrefix}/${revManifest['bundle.js']}`,
                SETTINGS: `${config.distUrlPrefix}/${revManifest['settings.js']}`,
            })
        }
    )(distDone)
}
exports.distHTML = distHTML
