const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const config = require('../config');
const swPrecache = require('sw-precache');

// This is used as the cacheID, worth only reading the file once.
const packageName = JSON.parse(fs.readFileSync('./package.json', 'utf8')).name;

const shellFiles = [
    '/**/*.html',
    '/manifest.json',
    '/images/*.{png,jpg,jpeg,gif,svg}',
    '/images/favicons/*.{png,jpg,jpeg,gif,svg}',

    // Bundles Dependencies
    '/dependencies.js',

    // Application Shell
    '/app/config.js',
    '/app/main.js',
    '/app/router.js',
    '/app/components/shell/**/*.{js,css}',

    // 404 Page
    '/app/pages/404/**/*.{js,css}'
];

function precache() {
    return swPrecache.write(path.join(config.dest, 'sw.js'), {
        staticFileGlobs: shellFiles.map((uri) => `${config.dest}${uri}`),
        stripPrefix: config.dest,
        navigateFallback: '/404',
        cacheId: packageName
    });
}

gulp.task(precache);
