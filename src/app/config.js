System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "~/*": "app/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "babel": "npm:babel-core@5.8.34",
    "babel-polyfill": "npm:babel-polyfill@6.3.14",
    "babel-runtime": "npm:babel-runtime@5.8.35",
    "backbone": "npm:backbone@1.2.3",
    "backbone.nativeajax": "github:akre54/Backbone.NativeAjax@0.4.3",
    "backbone.nativeview": "github:akre54/Backbone.NativeView@0.3.3",
    "core-js": "npm:core-js@1.2.6",
    "handlebars": "github:components/handlebars.js@4.0.5",
    "underscore": "npm:underscore@1.8.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-polyfill@6.3.14": {
      "babel-regenerator-runtime": "npm:babel-regenerator-runtime@6.3.13",
      "babel-runtime": "npm:babel-runtime@5.8.35",
      "core-js": "npm:core-js@1.2.6",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-regenerator-runtime@6.3.13": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-runtime@5.8.35": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:backbone@1.2.3": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
