/* eslint no-console: 0 */
var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var Builder = require('systemjs-builder');

function systemjs() {
    var builder = new Builder('./', path.join(config.dest, '/app/config.js'));
    var appPath = path.join(config.dest, '/app/**/*');
    var dependencies = `${appPath} - [${appPath}]`;
    var output = path.join(config.dest, '/dependencies.js');

    builder.config({
        paths: {
            '~/*': `${config.dest}/app/*.js`,
            'settings': `${config.dest}/settings.js`,
            'github:*': 'jspm_packages/github/*',
            'npm:*': 'jspm_packages/npm/*'
        }
    });

    return builder.bundle(dependencies, output, {
        minify: (config.env === 'production'),
        sourceMaps: (config.env !== 'production')
    })
    .catch((err) => {
        console.log('SystemJS Build error');
        console.log(err);
    });
}

gulp.task(systemjs);

gulp.task('systemjs:watch', () => {
    gulp.watch('./jspm_packages/**/*', {
        usePolling: true
    }, systemjs);
});
