const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const argv = require('yargs').argv;
const config = require('../config');
const pi = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function eslint() {
    return gulp.src([
        `${config.src}/**/*.js`
    ], {
        since: gulp.lastRun('eslint')
    })
    .pipe(pi.eslint({
        parser: 'babel-eslint',
        parserOptions: {
            ecmaVersion: 6,
            sourceType: 'module'
        },
        extends: 'eslint:recommended',
        globals: [
            'require',
            'SystemJS'
        ],
        quiet: argv.quiet,
        rules: {
            // Best Practices
            'accessor-pairs': ['error', {'getWithoutSet': false}],
            'block-scoped-var': 'error',
            'comma-dangle': ['error', 'never'],
            'complexity': ['error', 5],
            'consistent-return': 'error',
            'curly': ['error', 'all'],
            'default-case': 'error',
            'dot-location': ['error', 'property'],
            'dot-notation': ['error', {'allowKeywords': true }],
            'eqeqeq': 'error',
            'global-require': 'error',
            'guard-for-in': 'error',
            'no-alert': 'error',
            'no-caller': 'error',
            'no-case-declarations': 'error',
            'no-div-regex': 'error',
            'no-else-return': 'error',
            'no-empty-pattern': 'error',
            'no-eq-null': 'error',
            'no-eval': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-fallthrough': 'error',
            'no-floating-decimal': 'error',
            'no-implied-eval': 'error',
            'no-iterator': 'error',
            'no-labels': 'error',
            'no-lone-blocks': 'error',
            'no-loop-func': 'error',
            'no-multi-spaces': 'error',
            'no-multi-str': 'error',
            'no-native-reassign': 'error',
            'no-new-wrappers': 'error',
            'no-new': 'error',
            'no-octal': 'error',
            'no-octal-escape': 'error',
            'no-proto': 'error',
            'no-redeclare': 'error',
            'no-return-assign': 'error',
            'no-script-url': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-unused-expressions': ['error', {allowShortCircuit: true, allowTernary: true}],
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-escape': 'error',
            'no-void': 'error',
            'no-warning-comments': ['warn', {'terms': ['fix', 'hack', 'todo', 'xxx'], 'location': 'anywhere'}],
            'no-with': 'error',
            'radix': ['error', 'always'],
            'vars-on-top': 'error',
            'wrap-iife': ['error', 'inside'],

            // Strict Mode
            'strict': ['error', 'never'],

            // Variables
            'no-catch-shadow': 'error',
            'no-delete-var': 'error',
            'no-label-var': 'error',
            'no-shadow-restricted-names': 'error',
            'no-shadow': 'error',
            'no-undef-init': 'error',
            'no-undefined': 'error',
            'no-use-before-define': 'error',

            // Stylistic
            'array-bracket-spacing': ['error', 'never'],
            'block-spacing': ['error', 'never'],
            'brace-style': ['error', '1tbs', {'allowSingleLine': true }],
            'camelcase': 'error',
            'comma-spacing': ['error', {'before': false, 'after': true}],
            'comma-style': ['error', 'last'],
            'computed-property-spacing': ['error', 'never'],
            'eol-last': 'error',
            'indent': ['error', 4, {'SwitchCase': 0}],
            'key-spacing': ['error', {'beforeColon': false, 'afterColon': true}],
            'keyword-spacing': 'error',
            'linebreak-style': ['error', 'unix'],
            'max-depth': ['error', 4],
            'max-len': ['error', 120, 4, {'ignoreUrls': true}],
            'max-nested-callbacks': ['error', 3],
            'max-params': ['error', 4],
            'new-cap': 'error',
            'new-parens': 'error',
            'newline-after-var': ['error', 'always'],
            'no-array-constructor': 'error',
            'no-implicit-globals': 'error',
            'no-lonely-if': 'error',
            'no-mixed-spaces-and-tabs': ['error', false],
            'no-multiple-empty-lines': ['error', {'max': 2, 'maxEOF': 1}],
            'no-nested-ternary': 'error',
            'no-new-object': 'error',
            'no-spaced-func': 'error',
            'no-trailing-spaces': 'error',
            'no-whitespace-before-property': 'error',
            'one-var': ['error', 'never'],
            'operator-linebreak': ['error', 'after'],
            'padded-blocks': ['error', {
                'blocks': 'never',
                'switches': 'never',
                'classes': 'always'
            }],
            'quotes': ['error', 'single'],
            'semi-spacing': ['error', {'before': false, 'after': true}],
            'semi': ['error', 'always'],
            'space-before-blocks': ['error', 'always'],
            'space-before-function-paren': ['error', {'anonymous': 'always', 'named': 'never'}],
            'spaced-comment': ['error', 'always', {'exceptions': ['-*'] }],
            'space-in-parens': ['error', 'never'],
            'wrap-regex': 'error',

            // ECMAScript 2015
            'arrow-parens': ['error', 'always'],
            'arrow-spacing': 'error',
            'constructor-super': 'error',
            'generator-star-spacing': ['error', {'before': true, 'after': false}],
            'no-class-assign': 'error',
            'no-const-assign': 'error',
            'no-dupe-class-members': 'error',
            'no-duplicate-imports': 'error',
            'no-new-symbol': 'error',
            'no-this-before-super': 'error',
            'no-useless-computed-key': 'error',
            'no-useless-constructor': 'error',
            'no-useless-rename': 'error',
            'no-var': 'error',
            'object-shorthand': ['error', 'always', {'avoidQuotes': true}],
            'prefer-arrow-callback': 'error',
            'prefer-const': ['error', {
                'destructuring': 'any',
                'ignoreReadBeforeAssign': false
            }],
            'prefer-reflect': ['error', {'exceptions': ['delete']}],
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',
            'require-yield': 'error',
            'rest-spread-spacing': ['error', 'never'],
            'template-curly-spacing': ['error', 'never'],
            'yield-star-spacing': ['error', {'before': false, 'after': true}]
        },
        envs: [
            'browser',
            'node',
            'es6'
        ]
    }))
    .pipe(pi.eslint.format())
    .pipe(pi.eslint.results((results) => {
        if (results.errorCount > 0) {
            process.exitCode = 1;
        }
    }));
}

function compileScriptsBabel() {
    return gulp.src(`${config.src}/**/*.js`, {
        // since: gulp.lastRun('compileScriptsBabel')
    })
    // .pipe(pi.sourcemaps.init({loadMaps: true}))
    .pipe(pi.sourcemaps.init())
    .pipe(pi.replace(/@VERSION@/g, config.version))
    .pipe(pi.replace(/@ENV@/g, config.env))
    .pipe(pi.babel({
        presets: ['es2015'],
        plugins: [
            'transform-async-to-generator',
            'transform-class-properties',
            'transform-decorators-legacy',
            'transform-object-assign'
        ]
    }))
    .pipe(pi.sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest));
}

function compileScriptsWebpack() {
    return gulp.src([
        `${config.dest}/app/main.js`
    ]).pipe(webpack({
      // watch: true, // This causes gulp to freeze and not serve
      externals: /settings\.js$/,
      output: {
        path: path.resolve(config.dest),
        filename: "bundle.js",
        publicPath: "/", // for where to request chunks when the SinglePageApp changes the URL
        chunkFilename: "chunk-[chunkhash].js"
      },
      resolve: {
        alias: {
          "settings": path.resolve(config.dest, "settings.js"),
          "~": path.resolve(config.dest, "app/"),
        }
      },
      devtool: "sourcemap"
    }))
    .pipe(pi.sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest));
}

function minifyScripts() {
    return gulp.src([
        `${config.dest}/**/*.js`
    ])
    .pipe(pi.uglify({
        preserveComments: false,
        screwIE8: true
    }))
    .pipe(gulp.dest(config.dest));
}

gulp.task(eslint);
gulp.task(compileScriptsBabel);
gulp.task(compileScriptsWebpack);
gulp.task('minify-scripts', minifyScripts);

gulp.task('scripts', gulp.series(
    eslint,
    compileScriptsBabel,
    compileScriptsWebpack
));

gulp.task('scripts:watch', () => {
    gulp.watch(`${config.src}/**/*.js`, config.watchOpts)
    .on('change', gulp.series(
        eslint,
        compileScriptsBabel,
        compileScriptsWebpack,
        'reload-browser'
    ));
});
