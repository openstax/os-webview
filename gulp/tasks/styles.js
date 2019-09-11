const gulp = require('gulp');
const config = require('../config');
const bs = require('browser-sync').get(config.name);
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});
const sassLint = require('gulp-sass-lint');

function scsslint() {
    return gulp.src([`${config.src}/**/*.scss`], {
        since: gulp.lastRun(sassLint)
    })
    .pipe(sassLint({
        configFile: 'gulp/.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
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

function compileMainStyle(mainDone) {
    return gulp.parallel(
        () => compileStyles(
            gulp.src(`${config.src}/styles/main.scss`),
            `${config.dest}${config.urlPrefix}/styles`
        ),
    )(mainDone)
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
    compileAllStyles,
    compileMainStyle,
);
exports.styles.watch = watchStyles;
