const gulp = require('gulp');

require('require-dir')('.', {recurse: true});

/**
 *
 * Find any gulp tasks ending in ':watch' and automagically
 * run them with the 'watch' task.
 *
 */
const taskNames = Object.keys(gulp.registry().tasks());
const watchTasks = [];

for (let i = 0, l = taskNames.length; i < l; i++) {
    const taskName = taskNames[i];
    const taskParts = taskName.split(':');

    // Check length is greater one to avoid selecting this task &
    // check if the last part is 'watch'
    if (taskParts.length > 1 &&
        taskParts[taskParts.length - 1] === 'watch') {
        watchTasks.push(taskName);
    }
}

gulp.task('watch', gulp.series(
    'browser-sync',
    gulp.parallel(...watchTasks)
));
