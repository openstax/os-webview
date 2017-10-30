// const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
// const babel = require('rollup-plugin-babel');
// const superviews = require('rollup-plugin-superviews');
// const uglify = require('rollup-plugin-uglify');
// const { minify } = require('uglify-es');

module.exports = {
  input: 'dist/app/main.js',
  output: {
    file: 'dist/bundle.js',
    sourcemap: true,
    sourcemapFile: 'bundle.js.map',
    format: 'cjs' // 'iife'
  },
  // name: 'MyModule',
  plugins: [
    resolve(),
    commonjs()
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify( 'production' )
    // }),
    // superviews({
    //   include: 'src/**/*.html',
    //   // name: 'render', // if not provided defaults to 'render'
    //   // argstr: 'ctrl', // if not provided defaults to 'ctrl'
    //   // mode: 'es6' // if not provided defaults to 'es6'
    // }),
    // babel({
    //   // babelrc: false, // jest-babel uses that file which contains `"presets": ["env"]` which rollup does not like
    //   // plugins: ["transform-decorators-legacy"],
    //   runtimeHelpers: true,
    //   exclude: 'node_modules/**'
    // }),
    // resolve({
    //   // use "module" field for ES6 module if possible
    //   // module: false, // Default: true
    //
    //   // use "jsnext:main" if possible
    //   // – see https://github.com/rollup/rollup/wiki/jsnext:main
    //   // jsnext: false,  // Default: false
    //
    //   // use "main" field or index.js, even if it's not an ES6 module
    //   // (needs to be converted from CommonJS to ES6
    //   // – see https://github.com/rollup/rollup-plugin-commonjs
    //   // main: true,  // Default: true
    //
    //   // some package.json files have a `browser` field which
    //   // specifies alternative files to load for people bundling
    //   // for the browser. If that's you, use this option, otherwise
    //   // pkg.browser will be ignored
    //   // browser: true,  // Default: false
    //
    //   // not all files you want to resolve are .js files
    //   // extensions: [ '.js', '.json' ],  // Default: ['.js']
    //
    //   // whether to prefer built-in modules (e.g. `fs`, `path`) or
    //   // local ones with the same names
    //   // preferBuiltins: false,  // Default: true
    //
    //   // Lock the module search in this path (like a chroot). Module defined
    //   // outside this path will be mark has external
    //   // jail: '/my/jail/path', // Default: '/'
    //
    //   // If true, inspect resolved files to check that they are
    //   // ES2015 modules
    //   // modulesOnly: true, // Default: false
    //
    //   // Any additional options that should be passed through
    //   // to node-resolve
    //   // customResolveOptions: {
    //   //   moduleDirectory: 'js_modules'
    //   // }
    // }),
    // commonjs({
    //   // non-CommonJS modules will be ignored, but you can also
    //   // specifically include/exclude files
    //   include: 'node_modules/**',  // Default: undefined
    //   // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
    //   // these values can also be regular expressions
    //   // include: /node_modules/
    //
    //   // search for files other than .js files (must already
    //   // be transpiled by a previous plugin!)
    //   // extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]
    //
    //   // if true then uses of `global` won't be dealt with by this plugin
    //   // ignoreGlobal: false,  // Default: false
    //
    //   // if false then skip sourceMap generation for CommonJS modules
    //   // sourceMap: false,  // Default: true
    //
    //   // explicitly specify unresolvable named exports
    //   // (see below for more details)
    //   // namedExports: { './module.js': ['foo', 'bar' ] },  // Default: undefined
    //
    //   // sometimes you have to leave require statements
    //   // unconverted. Pass an array containing the IDs
    //   // or a `id => boolean` function. Only use this
    //   // option if you know what you're doing!
    //   // ignore: [ 'conditional-runtime-dependency' ]
    // }),
    // uglify({}, minify)
  ]
};
