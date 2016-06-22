const fs = require('fs');
const gulp = require('gulp');
const argv = require('yargs').argv;
const config = require('../config');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

const FAVICON_DATA_FILE = 'gulp/.favicon.json';

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
    if (config.env !== 'production') {
        return gulp.src(`${config.src}/*.html`, {
            since: gulp.lastRun('injectFaviconMarkup')
        })
        .pipe(gulp.dest(config.dest));
    }

    return gulp.src(`${config.src}/*.html`, {
        since: gulp.lastRun('injectFaviconMarkup')
    })
    .pipe(pi.realFavicon.injectFaviconMarkups(
        JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code,
        {keep: 'meta[property="og:image"]'}
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
        'reload-browser'
    ));
});
