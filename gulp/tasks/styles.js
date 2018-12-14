const gulp = require('gulp');
const config = require('../config');
const bs = require('browser-sync').get(config.name);
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function scsslint() {
    return gulp.src([`${config.src}/**/*.scss`], {
        since: gulp.lastRun(scsslint)
    })
    .pipe(pi.scssLint({
        'maxBuffer': 30000000000000000000 * 1024,
        config: 'gulp/.scss-lint.yml',
        customReport: (file) => {
            /* eslint prefer-template:0 */
            const colors = pi.util.colors;

            if (!file.scsslint.success) {
                process.exitCode = 1;

                pi.util.log(
                    colors.cyan(file.scsslint.issues.length) +
                    ' issues found in ' +
                    colors.magenta(file.path)
                );

                file.scsslint.issues.forEach((issue) => {
                    const severity = issue.severity === 'warning' ? colors.yellow(' [W] ') : colors.red(' [E] ');
                    const linter = issue.linter ? (`${issue.linter}: `) : '';
                    const logMsg = `${colors.cyan(file.relative)}:` +
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
        .pipe(pi.sourcemaps.init({loadMaps: true}))
        .pipe(pi.sass({
            includePaths: [
                './styles',
                './src/styles',
                './node_modules'
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
        .pipe(pi.sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: './'
        }))
        .pipe(gulp.dest(dest || config.dest))
        .pipe(bs.stream({match: '**/*.css'}));
}

function compileAllStyles() {
    const src = gulp.src(`${config.src}/**/*.scss`);

    return compileStyles(src);
}

function compileChangedStyles() {
    const src = gulp.src(`${config.src}/**/*.scss`, {
        since: gulp.lastRun(compileChangedStyles)
    });

    return compileStyles(src);
}

function compileMainStyle() {
    const src = gulp.src(`${config.src}/styles/main.scss`);
    const dest = `${config.dest}/styles`;

    return compileStyles(src, dest);
}

function watchStyles() {
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
};

exports.scsslint = scsslint;
exports.styles = gulp.series(
    scsslint,
    compileAllStyles
);
exports.styles.watch = watchStyles;
