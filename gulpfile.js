var gulp = require('gulp');
require('require-dir')('./gulp/tasks', {recurse: true});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'copy',
        'html',
        'styles',
        'scripts',
        'templates',
        'images'
    ),
    'systemjs',
    'precache',
    'minify-scripts'
));

gulp.task('dev', gulp.series(
    'development',
    'default',
    'watch'
));

gulp.task('dist', gulp.series('default'));

gulp.task('lint', gulp.parallel(
    'scsslint',
    'eslint'
));

gulp.task('test', gulp.parallel(
    'lint'
));
