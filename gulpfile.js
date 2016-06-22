var gulp = require('gulp');
require('require-dir')('./gulp/tasks', {recurse: true});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'copy',
        gulp.series(
            'favicon',
            'html'
        ),
        'styles',
        'scripts',
        'templates',
        'images'
    ),
    'jspm-builder'
));

gulp.task('dev-build', gulp.series(
    'development',
    'default'
));

gulp.task('dev', gulp.series(
    'dev-build',
    'ava',
    'watch'
));

gulp.task('dist', gulp.series(
    'production',
    'default',
    'precache',
    'minify-scripts',
    'humans'
));

gulp.task('lint', gulp.parallel(
    'scsslint',
    'eslint'
));

gulp.task('test', gulp.series(
    'dev-build',
    'ava'
));
