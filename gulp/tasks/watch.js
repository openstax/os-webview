'use strict';

var gulp = require('gulp'),
    taskNames, watchTasks;

require('require-dir')('.', {recurse: true});

/**
 *
 * Find any gulp tasks ending in ':watch' and automagically
 * run them with the 'watch' task.
 *
 */
taskNames = Object.keys(gulp.registry().tasks());
watchTasks = [];

for (let i = 0, l = taskNames.length; i < l; i++) {
    let taskName = taskNames[i];
    let taskParts = taskName.split(':');

    // Check length is greater one to avoid selecting this task &
    // check if the last part is 'watch'
    if (taskParts.length > 1 &&
        taskParts[taskParts.length - 1] === 'watch') {
        watchTasks.push(taskName);
    }
}

gulp.task('watch', gulp.series(
    'development',
    'browser-sync',
    gulp.parallel(...watchTasks)
));
