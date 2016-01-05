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
        config: 'gulp/.scss-lint.yml'
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
        .pipe(pi.if(config.env === 'production', pi.minifyCss()))
        .pipe(pi.if(config.env !== 'production', pi.sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: './'
        })))
        .pipe(gulp.dest(dest || config.dest));
        // BrowserSync currently doesn't support injecting @import'ed CSS files
        // See: https://github.com/BrowserSync/browser-sync/issues/10
        // .pipe(bs.stream({match: '**/*.css'}));
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
    ], gulp.series(
        scsslint,
        compileChangedStyles,
        bs.reload // Only necessary if BS stream isn't piped in above
    ));
});

gulp.task('component-styles:watch', () => {
    gulp.watch([
        `${config.src}/styles/components/**/*.scss`
    ], gulp.series(
        scsslint,
        compileMainStyle,
        bs.reload // Only necessary if BS stream isn't piped in above
    ));
});

gulp.task('fundamental-styles:watch', () => {
    gulp.watch([
        `${config.src}/styles/{mixins,variables}/**/*.scss`
    ], gulp.series(
        scsslint,
        compileAllStyles,
        bs.reload // Only necessary if BS stream isn't piped in above
    ));
});
