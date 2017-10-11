import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import handlebars from 'rollup-plugin-handlebars-plus';

export default {
  input: 'src/app/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs' // 'iife'
  },
  // name: 'MyModule',
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    handlebars({
      handlebars: {
        // The module ID of the Handlebars runtime, exporting `Handlebars` as `default`.
        // As a shortcut, you can pass this as the value of `handlebars` above.
        // See the "Handlebars" section below.
        // id: 'handlebars', // Default: the path of Handlebars' CJS definition within this module

        // Options to pass to Handlebars' `parse` and `precompile` methods.
        options: {
          // Whether to generate sourcemaps for the templates
          sourceMap: true // Default: true
        }
      },

      // The ID(s) of modules to import before every template, see the "Helpers" section below.
      // Can be a string too.
      // helpers: ['/utils/HandlebarsHelpers.js'], // Default: none

      // In case you want to compile files with other extensions.
      templateExtension: '.html', // Default: '.hbs'

      // A function that can determine whether or not a template is a partial.
      isPartial: (name) => name.startsWith('_'), // Default: as at left

      // The absolute paths of the root directory(ies) from which to try to resolve the partials.
      // You must also register these with `rollup-plugin-root-import`.
      // partialRoot: partialRoots, // Default: none

      // The module ID of jQuery, see the "jQuery" section below.
      // jquery: 'jquery' // Default: none
    }),
    resolve({
      // use "module" field for ES6 module if possible
      module: true, // Default: true

      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true,  // Default: false

      // use "main" field or index.js, even if it's not an ES6 module
      // (needs to be converted from CommonJS to ES6
      // – see https://github.com/rollup/rollup-plugin-commonjs
      main: true,  // Default: true

      // some package.json files have a `browser` field which
      // specifies alternative files to load for people bundling
      // for the browser. If that's you, use this option, otherwise
      // pkg.browser will be ignored
      browser: true,  // Default: false

      // not all files you want to resolve are .js files
      extensions: [ '.js', '.json' ],  // Default: ['.js']

      // whether to prefer built-in modules (e.g. `fs`, `path`) or
      // local ones with the same names
      preferBuiltins: false,  // Default: true

      // Lock the module search in this path (like a chroot). Module defined
      // outside this path will be mark has external
      // jail: '/my/jail/path', // Default: '/'

      // If true, inspect resolved files to check that they are
      // ES2015 modules
      // modulesOnly: true, // Default: false

      // Any additional options that should be passed through
      // to node-resolve
      // customResolveOptions: {
      //   moduleDirectory: 'js_modules'
      // }
    })
  ]
};
