var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').get(config.name);
var pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function eslint() {
    return gulp.src([
        'gulp/**/*.js',
        `${config.src}/**/*.js`,
        `!${config.src}/app/config.js`
    ], {
        since: gulp.lastRun('eslint')
    })
    .pipe(pi.eslint({
        parser: 'babel-eslint',
        extends: 'eslint:recommended',
        ecmaFeatures: {
            modules: true
        },
        globals: {
            require: false
        },
        rules: {
            // Best Practices
            'accessor-pairs': [2, {'getWithoutSet': false}],
            'block-scoped-var': 2,
            'complexity': [2, 10],
            'consistent-return': 2,
            'curly': 2,
            'default-case': 2,
            'dot-location': [2, 'property'],
            'dot-notation': 2,
            'eqeqeq': 2,
            'guard-for-in': 2,
            'no-alert': 2,
            'no-caller': 2,
            'no-case-declarations': 2,
            'no-div-regex': 2,
            'no-else-return': 2,
            'no-empty-label': 2,
            'no-empty-pattern': 2,
            'no-eq-null': 2,
            'no-eval': 2,
            'no-extend-native': 2,
            'no-extra-bind': 2,
            'no-fallthrough': 2,
            'no-floating-decimal': 2,
            'no-implied-eval': 2,
            'no-iterator': 2,
            'no-lone-blocks': 2,
            'no-loop-func': 2,
            'no-new-wrappers': 2,
            'no-new': 2,
            'no-octal-escape': 2,
            'no-octal': 2,
            'no-param-reassign': 2,
            'no-proto': 2,
            'no-redeclare': 2,
            'no-return-assign': 2,
            'no-script-url': 2,
            'no-self-compare': 2,
            'no-sequences': 2,
            'no-throw-literal': 2,
            'no-unused-expressions': [2, {allowShortCircuit: true, allowTernary: true}],
            'no-useless-call': 2,
            'no-useless-concat': 2,
            'no-void': 2,
            'no-warning-comments': [1, {'location': 'anywhere'}],
            'no-with': 2,
            'radix': [2, 'always'],
            'vars-on-top': 2,
            'wrap-iife': [2, 'inside'],

            // Variables
            'no-label-var': 2,
            'no-shadow-restricted-names': 2,
            'no-shadow': 2,
            'no-undef-init': 2,
            'no-undefined': 2,
            'no-use-before-define': 2,

            // Stylistic
            'array-bracket-spacing': [2, 'never'],
            'block-spacing': [2, 'never'],
            'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
            'camelcase': 2,
            'comma-spacing': [2, {'before': false, 'after': true}],
            'comma-style': [2, 'last'],
            'computed-property-spacing': [2, 'never'],
            'eol-last': 2,
            'indent': [2, 4, {'SwitchCase': 0}],
            'key-spacing': [2, {'beforeColon': false, 'afterColon': true}],
            'linebreak-style': [2, 'unix'],
            'max-depth': [2, 4],
            'max-len': [2, 120, 4, {'ignoreUrls': true}],
            'max-nested-callbacks': [2, 3],
            'max-params': [2, 3],
            'new-cap': 2,
            'new-parens': 2,
            'newline-after-var': [2, 'always'],
            'no-array-constructor': 2,
            'no-lonely-if': 2,
            'no-mixed-spaces-and-tabs': 2,
            'no-multiple-empty-lines': [2, {'max': 2, 'maxEOF': 1}],
            'no-nested-ternary': 2,
            'no-new-object': 2,
            'no-spaced-func': 2,
            'no-trailing-spaces': 2,
            'operator-linebreak': [2, 'after'],
            'padded-blocks': [2, 'never'],
            'quotes': [2, 'single'],
            'semi-spacing': [2, {'before': false, 'after': true}],
            'semi': [2, 'always'],
            'space-after-keywords': [2, 'always'],
            'space-before-blocks': 2,
            'space-before-function-paren': [2, {'anonymous': 'always', 'named': 'never'}],
            'spaced-comment': [2, 'always', { 'exceptions': ['-*'] }],
            'wrap-regex': 2,

            // ECMAScript 2015
            'arrow-body-style': [2, 'as-needed'],
            'arrow-parens': [2, 'always'],
            'arrow-spacing': 2,
            'constructor-super': 2,
            'generator-star-spacing': [2, {'before': true, 'after': false}],
            'no-class-assign': 2,
            'no-const-assign': 2,
            'no-dupe-class-members': 2,
            'no-this-before-super': 2,
            'prefer-arrow-callback': 2,
            'prefer-reflect': [2, {'exceptions': ['delete']}],
            'prefer-spread': 2,
            'prefer-template': 2,
            'require-yield': 2
        },
        envs: [
            'browser',
            'node',
            'es6'
        ]
    }))
    .pipe(pi.eslint.format());
}

function compileScripts() {
    return gulp.src(`${config.src}/**/*.js`, {
        since: gulp.lastRun('compileScripts')
    })
    .pipe(pi.if(config.env !== 'production', pi.sourcemaps.init()))
    .pipe(pi.replace(/@VERSION@/g, config.version))
    .pipe(pi.replace(/@ENV@/g, config.env))
    .pipe(pi.babel({
        presets: ['es2015'],
        plugins: [
            'transform-decorators-legacy',
            'transform-class-properties'
        ]
    }))
    .pipe(pi.if(config.env !== 'production', pi.sourcemaps.write('.')))
    .pipe(gulp.dest(config.dest));
}

function minifyScripts() {
    if (config.env !== 'production') {
        return Promise.resolve();
    }

    return gulp.src(`${config.dest}/**/*.js`)
        .pipe(pi.uglify())
        .pipe(gulp.dest(config.dest));
}

gulp.task(eslint);
gulp.task(compileScripts);
gulp.task('minify-scripts', minifyScripts);

gulp.task('scripts', gulp.series(
    'eslint',
    'compileScripts'
));

gulp.task('scripts:watch', () => {
    gulp.watch(`${config.src}/**/*.js`, gulp.series(
        eslint,
        compileScripts,
        bs.reload
    ));
});
