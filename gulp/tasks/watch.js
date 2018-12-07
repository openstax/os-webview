'use strict';

const gulp = require('gulp');

require('require-dir')('.', {recurse: true});

/**
 * Find any gulp tasks ending in ':watch' and automagically
 * run them with the 'watch' task.
 */
const taskNames = Object.keys(gulp.registry().tasks());
const watchTasks = taskNames.filter((n) => n.substr(-6) === ':watch');

gulp.task('watch', gulp.series(
    'browser-sync',
    gulp.parallel(...watchTasks)
));
