var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').get(config.name);
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function scsslint() {
    return gulp.src([`${config.src}/**/*.scss`], {
        since: gulp.lastRun('scsslint')
    })
    .pipe(pi.scssLint({
        config: 'gulp/.scss-lint.yml',
        customReport: (file) => {
            /* eslint prefer-template:0 */
            var colors = pi.util.colors;

            if (!file.scsslint.success) {
                process.exitCode = 1;

                pi.util.log(
                    colors.cyan(file.scsslint.issues.length) +
                    ' issues found in ' +
                    colors.magenta(file.path)
                );

                file.scsslint.issues.forEach((issue) => {
                    var severity = issue.severity === 'warning' ? colors.yellow(' [W] ') : colors.red(' [E] ');
                    var linter = issue.linter ? (`${issue.linter}: `) : '';
                    var logMsg = `${colors.cyan(file.relative)}:` +
                        colors.magenta(issue.line) +
                        severity +
                        colors.green(linter) +
                        issue.reason;

                    pi.util.log(logMsg);
                });
            }
        }
    }));
}

function compileStyles(src, dest) {
    return src
        .pipe(pi.if(config.env !== 'production', pi.sourcemaps.init()))
        .pipe(pi.sass({
            includePaths: [
                './styles',
                './src/styles'
            ]
        }))
        .pipe(pi.autoprefixer(config.browsers))
        .pipe(pi.if(config.env === 'production', pi.cssnano({
            reduceIdents: {
                keyframes: false
            },
            discardUnused: {
                keyframes: false
            }
        })))
        .pipe(pi.if(config.env !== 'production', pi.sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: './'
        })))
        .pipe(gulp.dest(dest || config.dest))
        .pipe(bs.stream({match: '**/*.css'}));
}

function compileAllStyles() {
    var src = gulp.src(`${config.src}/**/*.scss`);

    return compileStyles(src);
}

function compileChangedStyles() {
    var src = gulp.src(`${config.src}/**/*.scss`, {
        since: gulp.lastRun('compileChangedStyles')
    });

    return compileStyles(src);
}

function compileMainStyle() {
    var src = gulp.src(`${config.src}/styles/main.scss`);
    var dest = `${config.dest}/styles`;

    return compileStyles(src, dest);
}

gulp.task(scsslint);
gulp.task(compileStyles);
gulp.task(compileAllStyles);
gulp.task(compileChangedStyles);
gulp.task(compileMainStyle);

gulp.task('styles', gulp.series(
    scsslint,
    compileAllStyles
));

gulp.task('styles:watch', () => {
    gulp.watch([
        `${config.src}/**/*.scss`,
        `!${config.src}/styles/{components,mixins,variables}/**/*.scss`
    ], config.watchOpts)
    .on('change', gulp.series(
        scsslint,
        compileChangedStyles
    ));

    gulp.watch(`${config.src}/styles/components/**/*.scss`, config.watchOpts)
    .on('change', gulp.series(
        scsslint,
        compileMainStyle
    ));

    gulp.watch(`${config.src}/styles/{mixins,variables}/**/*.scss`, config.watchOpts)
    .on('change', gulp.series(
        scsslint,
        compileAllStyles
    ));
});
