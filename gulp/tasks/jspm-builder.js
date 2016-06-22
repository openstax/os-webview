const path = require('path');
const gulp = require('gulp');
const jspm = require('jspm');
const config = require('../config');

const glob = [
    'jspm_packages/system.js',
    'jspm_packages/system.js.map',
    'jspm_packages/system-polyfills.js',
    'jspm_packages/system-polyfills.js.map',
    'jspm_packages/**/*.json'
];

function copyDependencies() {
    return gulp.src(glob, {
        base: './',
        since: gulp.lastRun(copyDependencies)
    })
    .pipe(gulp.dest(config.dest));
}

function jspmBuilder() {
    const appPath = path.join(config.dest, '/app/**/*');
    const dependencies = `${appPath}.js - [${appPath}]`;
    const output = path.join(config.dest, '/libs/dependencies.js');
    const builder = new jspm.Builder();

    builder.config({
        defaultJSExtensions: true,
        paths: {
            '~/*': `${config.dest}/app/*`,
            'settings': `${config.dest}/settings.js`
        }
    });

    return builder.bundle(dependencies, output, {
        minify: (config.env === 'production'),
        sourceMaps: (config.env !== 'production')
    })
    .catch((err) => {
        /* eslint no-console: 0 */
        console.log('JSPM Build error');
        console.log(err);
    });
}

gulp.task(copyDependencies);
gulp.task('jspm-builder', gulp.parallel(
    copyDependencies,
    jspmBuilder
));

gulp.task('jspm:watch', () => {
    gulp.watch('./jspm_packages/**/*', config.watchOpts)
    .on('change', gulp.series(
        'jspm-builder',
        'reload-browser'
    ));
});
