var gulp = require('gulp');
require('require-dir')('./gulp/tasks', {recurse: true});

gulp.task('default', gulp.series(
    'clean',
    'flags',
    gulp.parallel(
        'copy',
        'html',
        'styles',
        'scripts',
        'templates',
        'images'
    ),
    'systemjs'
));

gulp.task('dev', gulp.series(
    'development',
    'default',
    'watch'
));

gulp.task('dist', gulp.series(
    'production',
    'default',
    'minify-scripts',
    'precache'
));

gulp.task('lint', gulp.parallel(
    'scsslint',
    'eslint'
));

gulp.task('test', gulp.series('lint'));
