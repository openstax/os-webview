var fs = require('fs');
var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').get(config.name);
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

var FAVICON_DATA_FILE = `${__dirname}/.favicon.json`;

function generateFavicons(done) {
    if (config.env !== 'production') {
        done();
        return;
    }

    pi.realFavicon.generateFavicon({
        masterPicture: `${config.src}/images/favicon.svg`,
        dest: config.dest,
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
    .pipe(pi.if(config.env === 'production',
        pi.realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code)
    ))
    .pipe(gulp.dest(config.dest));
}

gulp.task(generateFavicons);
gulp.task(injectFaviconMarkup);

gulp.task('favicon', gulp.series(
    generateFavicons,
    injectFaviconMarkup
));

gulp.task('favicon:watch', () => {
    gulp.watch(`${config.src}/*.html`, config.watchOpts)
    .on('change', gulp.series(
        'favicon',
        bs.reload
    ));
});
