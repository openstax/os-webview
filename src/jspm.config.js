SystemJS.config({
  paths: {
    "gtm": "https://www.googletagmanager.com/gtm.js"
  },
  meta: {
    "gtm": {
      "scriptLoad": true,
      "exports": "dataLayer",
      "format": "global"
    }
  },
  nodeConfig: {
    "paths": {
      "npm:": "jspm_packages/npm/",
      "github:": "jspm_packages/github/",
      "~/": "src/app/",
      "settings": "src/settings"
    }
  },
  packages: {
    "~": {
      "main": "app/main.js",
      "format": "cjs",
      "defaultExtension": "js"
    }
  },
  shim: {
    "fetch": {
      "exports": "fetch"
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "babel-polyfill": "npm:babel-polyfill@6.9.1",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "classList": "npm:classlist-polyfill@1.0.3",
    "fetch": "npm:whatwg-fetch@1.0.0",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "incremental-dom": "npm:incremental-dom@0.4.1",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "recordo": "npm:recordo@0.0.6",
    "superb": "npm:superb.js@0.2.2"
  },
  packages: {
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.7.0"
      }
    },
    "npm:buffer@4.7.0": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "ieee754": "npm:ieee754@1.1.6",
        "base64-js": "npm:base64-js@1.1.2"
      }
    },
    "npm:recordo@0.0.6": {
      "map": {
        "lodash": "npm:lodash@3.10.1",
        "good-listener": "npm:good-listener@1.1.7",
        "clipboard": "npm:clipboard@1.5.12"
      }
    },
    "npm:clipboard@1.5.12": {
      "map": {
        "good-listener": "npm:good-listener@1.1.7",
        "select": "npm:select@1.0.6",
        "tiny-emitter": "npm:tiny-emitter@1.1.0"
      }
    },
    "npm:good-listener@1.1.7": {
      "map": {
        "delegate": "npm:delegate@3.0.1"
      }
    },
    "npm:delegate@3.0.1": {
      "map": {
        "closest": "npm:closest@0.0.1"
      }
    },
    "npm:closest@0.0.1": {
      "map": {
        "matches-selector": "npm:matches-selector@0.0.1"
      }
    },
    "npm:babel-polyfill@6.9.1": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.9.5",
        "babel-runtime": "npm:babel-runtime@6.9.2",
        "core-js": "npm:core-js@2.4.0"
      }
    },
    "npm:babel-runtime@6.9.2": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.9.5",
        "core-js": "npm:core-js@2.4.0"
      }
    }
  }
});
