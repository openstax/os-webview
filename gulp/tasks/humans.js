const spawnSync = require('child_process').spawnSync;
const gulp = require('gulp');
const config = require('../config');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function humans() {
    const committers = spawnSync('git', ['shortlog', '-sn'], {
        encoding: 'utf8',
        stdio: [0, 'pipe', 'ignore']
    }).stdout.trim().split('\n');

    return gulp.src(`${config.src}/index.html`)
    .pipe(pi.humans({
        thanks: committers,
        site: [
            `Last update: ${new Date().toLocaleDateString('en-US', {
                timeZone: 'America/Chicago',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })}`,
            'Standards: ECMAScript 2016, HTML5, CSS3, WCAG2A',
            'Components: SystemJS, SuperbJS, Incremental DOM',
            'Software: Gulp, JSPM, SCSS, Superviews.js'
        ]
    }))
    .pipe(gulp.dest(config.dest));
}

gulp.task(humans);
