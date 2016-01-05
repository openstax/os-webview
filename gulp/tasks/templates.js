var path = require('path');
var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').get(config.name);
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del'],
    rename: {
        'gulp-clip-empty-files': 'clip'
    }
});

function precompileHandlebars(src, wrapper) {
    return src
        .pipe(pi.rename((uri) => {
            uri.extname = '.hbs.js';
        }))
        .pipe(pi.if(config.env !== 'production', pi.sourcemaps.init()))
        .pipe(pi.handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrapper)
        .pipe(pi.babel({
            presets: ['es2015']
        }))
        .pipe(pi.replace(/@VERSION@/g, config.version))
        .pipe(pi.if(config.env === 'production', pi.uglify()))
        .pipe(pi.if(config.env !== 'production', pi.sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: './'
        })))
        .pipe(pi.clip())
        .pipe(gulp.dest(config.dest));
}

function precompilePartials() {
    var src = gulp.src(`${config.src}/**/*.part.hbs`, {
        since: gulp.lastRun('precompilePartials')
    });
    var header = 'import Handlebars from \'handlebars\';' +
        ';export var partial = Handlebars.registerPartial' +
        '(<%= pro(file.relative) %>, Handlebars.template(<%= contents %>));';
    var wrapper = pi.wrap(header, {}, {
        imports: {
            pro: function (file) {
                return JSON.stringify(`${path.dirname(file)}/${path.basename(file, '.js')}`);
            }
        }
    });

    return precompileHandlebars(src, wrapper);
}

function precompileTemplates() {
    var src = gulp.src([
        `${config.src}/**/*.hbs`,
        `!${config.src}/**/*.part.hbs`
    ], {
        since: gulp.lastRun('precompileTemplates')
    });
    var header = 'import Handlebars from \'handlebars\';' +
        'export var template = Handlebars.template(<%= contents %>)';
    var wrapper = pi.wrap(header);

    return precompileHandlebars(src, wrapper);
}

gulp.task(precompilePartials);
gulp.task(precompileTemplates);

gulp.task('templates', gulp.parallel(
    'precompilePartials',
    'precompileTemplates'
));

gulp.task('templates:watch', () => {
    gulp.watch(`${config.src}/**/*.part.hbs`, gulp.series(
        precompilePartials,
        bs.reload
    ));

    gulp.watch([
        `${config.src}/**/*.hbs`,
        `!${config.src}/**/*.part.hbs`
    ], gulp.series(
        precompileTemplates,
        bs.reload
    ));
});
