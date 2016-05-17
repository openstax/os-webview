var fs = require('fs');
var gulp = require('gulp');
var argv = require('yargs').argv;
var config = require('../config');
var bs = require('browser-sync').get(config.name);
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

var FAVICON_DATA_FILE = 'gulp/.favicon.json';

function generateFavicons(done) {
    if (!argv.favicons) {
        done();
        return;
    }

    pi.realFavicon.generateFavicon({
        masterPicture: `${config.src}/images/favicon.svg`,
        dest: 'gulp/.favicons',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '18%',
                appName: 'OpenStax'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'whiteSilhouette',
                backgroundColor: '#da532c',
                onConflict: 'override',
                appName: 'OpenStax'
            },
            androidChrome: {
                pictureAspect: 'backgroundAndMargin',
                margin: '21%',
                backgroundColor: '#ffffff',
                themeColor: '#f47641',
                manifest: {
                    name: 'OpenStax',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#f47641'
            }
        },
        settings: {
            compression: 1,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: true
        },
        markupFile: FAVICON_DATA_FILE
    }, () => {
        done();
    });
}

function injectFaviconMarkup() {
    return gulp.src(`${config.src}/*.html`, {
        since: gulp.lastRun('injectFaviconMarkup')
    })
    .pipe(pi.realFavicon.injectFaviconMarkups(
        JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code
    ))
    .pipe(gulp.dest(config.dest));
}

function copyFavicons() {
    return gulp.src([
        'gulp/.favicons/**/*.{ico,json,png,svg,xml}'
    ])
    .pipe(gulp.dest(config.dest));
}

gulp.task(generateFavicons);
gulp.task(injectFaviconMarkup);
gulp.task(copyFavicons);

gulp.task('favicon', gulp.series(
    generateFavicons,
    injectFaviconMarkup,
    copyFavicons
));

gulp.task('favicon:watch', () => {
    gulp.watch(`${config.src}/*.html`, config.watchOpts)
    .on('change', gulp.series(
        injectFaviconMarkup,
        bs.reload
    ));
});
