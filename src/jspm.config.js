SystemJS.config({
  paths: {
    "ga": "https://www.google-analytics.com/analytics.js"
  },
  devConfig: {
    "map": {
      "jest": "npm:jest@19.0.2",
      "uglify-to-browserify": "npm:uglify-to-browserify@1.0.2",
      "uglify-js": "npm:uglify-js@2.8.29",
      "source-map": "npm:source-map@0.5.7",
      "element-dataset": "npm:element-dataset@2.2.6",
      "punycode": "npm:jspm-nodelibs-punycode@0.2.1",
      "console": "npm:jspm-nodelibs-console@0.2.3"
    },
    "packages": {
      "npm:element-dataset@2.2.6": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.26.0"
        }
      },
      "npm:uglify-js@2.8.29": {
        "map": {
          "source-map": "npm:source-map@0.5.7",
          "yargs": "npm:yargs@3.10.0"
        }
      },
      "npm:jspm-nodelibs-punycode@0.2.1": {
        "map": {
          "punycode": "npm:punycode@1.4.1"
        }
      },
      "npm:jest@19.0.2": {
        "map": {
          "jest-cli": "npm:jest-cli@19.0.2"
        }
      },
      "npm:yargs@3.10.0": {
        "map": {
          "decamelize": "npm:decamelize@1.2.0",
          "cliui": "npm:cliui@2.1.0",
          "camelcase": "npm:camelcase@1.2.1",
          "window-size": "npm:window-size@0.1.0"
        }
      },
      "npm:jest-cli@19.0.2": {
        "map": {
          "yargs": "npm:yargs@6.6.0",
          "is-ci": "npm:is-ci@1.0.10",
          "callsites": "npm:callsites@2.0.0",
          "string-length": "npm:string-length@1.0.1",
          "slash": "npm:slash@1.0.0",
          "ansi-escapes": "npm:ansi-escapes@1.4.0",
          "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.1.1",
          "jest-regex-util": "npm:jest-regex-util@19.0.0",
          "throat": "npm:throat@3.2.0",
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "worker-farm": "npm:worker-farm@1.5.0",
          "jest-message-util": "npm:jest-message-util@19.0.0",
          "which": "npm:which@1.3.0",
          "jest-resolve-dependencies": "npm:jest-resolve-dependencies@19.0.0",
          "istanbul-api": "npm:istanbul-api@1.1.14",
          "chalk": "npm:chalk@1.1.3",
          "jest-changed-files": "npm:jest-changed-files@19.0.2",
          "istanbul-lib-instrument": "npm:istanbul-lib-instrument@1.8.0",
          "jest-haste-map": "npm:jest-haste-map@19.0.2",
          "jest-snapshot": "npm:jest-snapshot@19.0.2",
          "jest-environment-jsdom": "npm:jest-environment-jsdom@19.0.2",
          "node-notifier": "npm:node-notifier@5.1.2",
          "jest-config": "npm:jest-config@19.0.4",
          "jest-util": "npm:jest-util@19.0.2",
          "jest-jasmine2": "npm:jest-jasmine2@19.0.2",
          "jest-runtime": "npm:jest-runtime@19.0.4",
          "micromatch": "npm:micromatch@2.3.11"
        }
      },
      "npm:yargs@6.6.0": {
        "map": {
          "camelcase": "npm:camelcase@3.0.0",
          "cliui": "npm:cliui@3.2.0",
          "decamelize": "npm:decamelize@1.2.0",
          "set-blocking": "npm:set-blocking@2.0.0",
          "string-width": "npm:string-width@1.0.2",
          "get-caller-file": "npm:get-caller-file@1.0.2",
          "require-main-filename": "npm:require-main-filename@1.0.1",
          "read-pkg-up": "npm:read-pkg-up@1.0.1",
          "which-module": "npm:which-module@1.0.0",
          "os-locale": "npm:os-locale@1.4.0",
          "require-directory": "npm:require-directory@2.1.1",
          "y18n": "npm:y18n@3.2.1",
          "yargs-parser": "npm:yargs-parser@4.2.1"
        }
      },
      "npm:worker-farm@1.5.0": {
        "map": {
          "xtend": "npm:xtend@4.0.1",
          "errno": "npm:errno@0.1.4"
        }
      },
      "npm:cliui@3.2.0": {
        "map": {
          "string-width": "npm:string-width@1.0.2",
          "strip-ansi": "npm:strip-ansi@3.0.1",
          "wrap-ansi": "npm:wrap-ansi@2.1.0"
        }
      },
      "npm:istanbul-api@1.1.14": {
        "map": {
          "mkdirp": "npm:mkdirp@0.5.1",
          "once": "npm:once@1.4.0",
          "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.1.1",
          "istanbul-lib-instrument": "npm:istanbul-lib-instrument@1.8.0",
          "fileset": "npm:fileset@2.0.3",
          "istanbul-lib-report": "npm:istanbul-lib-report@1.1.1",
          "istanbul-lib-hook": "npm:istanbul-lib-hook@1.0.7",
          "istanbul-lib-source-maps": "npm:istanbul-lib-source-maps@1.2.1",
          "istanbul-reports": "npm:istanbul-reports@1.1.2",
          "js-yaml": "npm:js-yaml@3.10.0",
          "async": "npm:async@2.5.0"
        }
      },
      "npm:istanbul-lib-instrument@1.8.0": {
        "map": {
          "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.1.1",
          "semver": "npm:semver@5.4.1",
          "babel-template": "npm:babel-template@6.26.0",
          "babel-traverse": "npm:babel-traverse@6.26.0",
          "babel-generator": "npm:babel-generator@6.26.0",
          "babel-types": "npm:babel-types@6.26.0",
          "babylon": "npm:babylon@6.18.0"
        }
      },
      "npm:string-length@1.0.1": {
        "map": {
          "strip-ansi": "npm:strip-ansi@3.0.1"
        }
      },
      "npm:cliui@2.1.0": {
        "map": {
          "wordwrap": "npm:wordwrap@0.0.2",
          "right-align": "npm:right-align@0.1.3",
          "center-align": "npm:center-align@0.1.3"
        }
      },
      "npm:jest-runtime@19.0.4": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "jest-regex-util": "npm:jest-regex-util@19.0.0",
          "yargs": "npm:yargs@6.6.0",
          "chalk": "npm:chalk@1.1.3",
          "jest-config": "npm:jest-config@19.0.4",
          "jest-haste-map": "npm:jest-haste-map@19.0.2",
          "jest-util": "npm:jest-util@19.0.2",
          "micromatch": "npm:micromatch@2.3.11",
          "strip-bom": "npm:strip-bom@3.0.0",
          "json-stable-stringify": "npm:json-stable-stringify@1.0.1",
          "jest-file-exists": "npm:jest-file-exists@19.0.0",
          "babel-plugin-istanbul": "npm:babel-plugin-istanbul@4.1.5",
          "jest-resolve": "npm:jest-resolve@19.0.2",
          "babel-jest": "npm:babel-jest@19.0.0",
          "babel-core": "npm:babel-core@6.26.0"
        }
      },
      "npm:jest-message-util@19.0.0": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "micromatch": "npm:micromatch@2.3.11"
        }
      },
      "npm:which@1.3.0": {
        "map": {
          "isexe": "npm:isexe@2.0.0"
        }
      },
      "npm:chalk@1.1.3": {
        "map": {
          "strip-ansi": "npm:strip-ansi@3.0.1",
          "has-ansi": "npm:has-ansi@2.0.0",
          "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
          "ansi-styles": "npm:ansi-styles@2.2.1",
          "supports-color": "npm:supports-color@2.0.0"
        }
      },
      "npm:jest-haste-map@19.0.2": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "micromatch": "npm:micromatch@2.3.11",
          "worker-farm": "npm:worker-farm@1.5.0",
          "fb-watchman": "npm:fb-watchman@2.0.0",
          "sane": "npm:sane@1.5.0"
        }
      },
      "npm:jest-snapshot@19.0.2": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "jest-util": "npm:jest-util@19.0.2",
          "natural-compare": "npm:natural-compare@1.4.0",
          "jest-file-exists": "npm:jest-file-exists@19.0.0",
          "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0",
          "jest-diff": "npm:jest-diff@19.0.0",
          "pretty-format": "npm:pretty-format@19.0.0"
        }
      },
      "npm:jest-config@19.0.4": {
        "map": {
          "jest-environment-jsdom": "npm:jest-environment-jsdom@19.0.2",
          "jest-regex-util": "npm:jest-regex-util@19.0.0",
          "chalk": "npm:chalk@1.1.3",
          "jest-jasmine2": "npm:jest-jasmine2@19.0.2",
          "jest-resolve": "npm:jest-resolve@19.0.2",
          "jest-validate": "npm:jest-validate@19.0.2",
          "jest-environment-node": "npm:jest-environment-node@19.0.2",
          "pretty-format": "npm:pretty-format@19.0.0"
        }
      },
      "npm:jest-environment-jsdom@19.0.2": {
        "map": {
          "jest-util": "npm:jest-util@19.0.2",
          "jest-mock": "npm:jest-mock@19.0.0",
          "jsdom": "npm:jsdom@9.12.0"
        }
      },
      "npm:jest-util@19.0.2": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "jest-message-util": "npm:jest-message-util@19.0.0",
          "mkdirp": "npm:mkdirp@0.5.1",
          "chalk": "npm:chalk@1.1.3",
          "jest-file-exists": "npm:jest-file-exists@19.0.0",
          "leven": "npm:leven@2.1.0",
          "jest-validate": "npm:jest-validate@19.0.2",
          "jest-mock": "npm:jest-mock@19.0.0"
        }
      },
      "npm:node-notifier@5.1.2": {
        "map": {
          "semver": "npm:semver@5.4.1",
          "which": "npm:which@1.3.0",
          "growly": "npm:growly@1.3.0",
          "shellwords": "npm:shellwords@0.1.1"
        }
      },
      "npm:is-ci@1.0.10": {
        "map": {
          "ci-info": "npm:ci-info@1.1.1"
        }
      },
      "npm:jest-jasmine2@19.0.2": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "jest-message-util": "npm:jest-message-util@19.0.0",
          "jest-snapshot": "npm:jest-snapshot@19.0.2",
          "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0",
          "jest-matchers": "npm:jest-matchers@19.0.0"
        }
      },
      "npm:yargs-parser@4.2.1": {
        "map": {
          "camelcase": "npm:camelcase@3.0.0"
        }
      },
      "npm:istanbul-lib-report@1.1.1": {
        "map": {
          "mkdirp": "npm:mkdirp@0.5.1",
          "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.1.1",
          "supports-color": "npm:supports-color@3.2.3",
          "path-parse": "npm:path-parse@1.0.5"
        }
      },
      "npm:istanbul-lib-source-maps@1.2.1": {
        "map": {
          "mkdirp": "npm:mkdirp@0.5.1",
          "rimraf": "npm:rimraf@2.6.2",
          "debug": "npm:debug@2.6.9",
          "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.1.1",
          "source-map": "npm:source-map@0.5.7"
        }
      },
      "npm:fileset@2.0.3": {
        "map": {
          "glob": "npm:glob@7.1.2",
          "minimatch": "npm:minimatch@3.0.4"
        }
      },
      "npm:jest-resolve-dependencies@19.0.0": {
        "map": {
          "jest-file-exists": "npm:jest-file-exists@19.0.0"
        }
      },
      "npm:os-locale@1.4.0": {
        "map": {
          "lcid": "npm:lcid@1.0.0"
        }
      },
      "npm:micromatch@2.3.11": {
        "map": {
          "parse-glob": "npm:parse-glob@3.0.4",
          "filename-regex": "npm:filename-regex@2.0.1",
          "array-unique": "npm:array-unique@0.2.1",
          "is-extglob": "npm:is-extglob@1.0.0",
          "object.omit": "npm:object.omit@2.0.1",
          "is-glob": "npm:is-glob@2.0.1",
          "arr-diff": "npm:arr-diff@2.0.0",
          "normalize-path": "npm:normalize-path@2.1.1",
          "regex-cache": "npm:regex-cache@0.4.4",
          "extglob": "npm:extglob@0.3.2",
          "expand-brackets": "npm:expand-brackets@0.1.5",
          "kind-of": "npm:kind-of@3.2.2",
          "braces": "npm:braces@1.8.5"
        }
      },
      "npm:babel-template@6.26.0": {
        "map": {
          "lodash": "npm:lodash@4.17.4",
          "babel-runtime": "npm:babel-runtime@6.26.0",
          "babel-traverse": "npm:babel-traverse@6.26.0",
          "babel-types": "npm:babel-types@6.26.0",
          "babylon": "npm:babylon@6.18.0"
        }
      },
      "npm:wrap-ansi@2.1.0": {
        "map": {
          "string-width": "npm:string-width@1.0.2",
          "strip-ansi": "npm:strip-ansi@3.0.1"
        }
      },
      "npm:read-pkg-up@1.0.1": {
        "map": {
          "read-pkg": "npm:read-pkg@1.1.0",
          "find-up": "npm:find-up@1.1.2"
        }
      },
      "npm:babel-traverse@6.26.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.26.0",
          "babel-types": "npm:babel-types@6.26.0",
          "debug": "npm:debug@2.6.9",
          "lodash": "npm:lodash@4.17.4",
          "babylon": "npm:babylon@6.18.0",
          "invariant": "npm:invariant@2.2.2",
          "babel-messages": "npm:babel-messages@6.23.0",
          "globals": "npm:globals@9.18.0",
          "babel-code-frame": "npm:babel-code-frame@6.26.0"
        }
      },
      "npm:babel-plugin-istanbul@4.1.5": {
        "map": {
          "find-up": "npm:find-up@2.1.0",
          "istanbul-lib-instrument": "npm:istanbul-lib-instrument@1.8.0",
          "test-exclude": "npm:test-exclude@4.1.1"
        }
      },
      "npm:right-align@0.1.3": {
        "map": {
          "align-text": "npm:align-text@0.1.4"
        }
      },
      "npm:center-align@0.1.3": {
        "map": {
          "align-text": "npm:align-text@0.1.4",
          "lazy-cache": "npm:lazy-cache@1.0.4"
        }
      },
      "npm:async@2.5.0": {
        "map": {
          "lodash": "npm:lodash@4.17.4"
        }
      },
      "npm:babel-generator@6.26.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.26.0",
          "babel-types": "npm:babel-types@6.26.0",
          "lodash": "npm:lodash@4.17.4",
          "source-map": "npm:source-map@0.5.7",
          "detect-indent": "npm:detect-indent@4.0.0",
          "trim-right": "npm:trim-right@1.0.1",
          "babel-messages": "npm:babel-messages@6.23.0",
          "jsesc": "npm:jsesc@1.3.0"
        }
      },
      "npm:babel-types@6.26.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.26.0",
          "lodash": "npm:lodash@4.17.4",
          "to-fast-properties": "npm:to-fast-properties@1.0.3",
          "esutils": "npm:esutils@2.0.2"
        }
      },
      "npm:istanbul-lib-hook@1.0.7": {
        "map": {
          "append-transform": "npm:append-transform@0.4.0"
        }
      },
      "npm:errno@0.1.4": {
        "map": {
          "prr": "npm:prr@0.0.0"
        }
      },
      "npm:has-ansi@2.0.0": {
        "map": {
          "ansi-regex": "npm:ansi-regex@2.1.1"
        }
      },
      "npm:parse-glob@3.0.4": {
        "map": {
          "is-extglob": "npm:is-extglob@1.0.0",
          "is-glob": "npm:is-glob@2.0.1",
          "is-dotfile": "npm:is-dotfile@1.0.3",
          "glob-base": "npm:glob-base@0.3.0"
        }
      },
      "npm:jest-resolve@19.0.2": {
        "map": {
          "jest-haste-map": "npm:jest-haste-map@19.0.2",
          "browser-resolve": "npm:browser-resolve@1.11.2",
          "resolve": "npm:resolve@1.4.0"
        }
      },
      "npm:sane@1.5.0": {
        "map": {
          "fb-watchman": "npm:fb-watchman@1.9.2",
          "minimist": "npm:minimist@1.2.0",
          "minimatch": "npm:minimatch@3.0.4",
          "exec-sh": "npm:exec-sh@0.2.1",
          "walker": "npm:walker@1.0.7",
          "anymatch": "npm:anymatch@1.3.2",
          "watch": "npm:watch@0.10.0"
        }
      },
      "npm:jest-matcher-utils@19.0.0": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "pretty-format": "npm:pretty-format@19.0.0"
        }
      },
      "npm:jest-validate@19.0.2": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0",
          "leven": "npm:leven@2.1.0",
          "pretty-format": "npm:pretty-format@19.0.0"
        }
      },
      "npm:jest-diff@19.0.0": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0",
          "pretty-format": "npm:pretty-format@19.0.0",
          "diff": "npm:diff@3.3.1"
        }
      },
      "npm:jest-matchers@19.0.0": {
        "map": {
          "jest-diff": "npm:jest-diff@19.0.0",
          "jest-message-util": "npm:jest-message-util@19.0.0",
          "jest-regex-util": "npm:jest-regex-util@19.0.0",
          "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0"
        }
      },
      "npm:babel-jest@19.0.0": {
        "map": {
          "babel-plugin-istanbul": "npm:babel-plugin-istanbul@4.1.5",
          "babel-core": "npm:babel-core@6.26.0",
          "babel-preset-jest": "npm:babel-preset-jest@19.0.0"
        }
      },
      "npm:lcid@1.0.0": {
        "map": {
          "invert-kv": "npm:invert-kv@1.0.0"
        }
      },
      "npm:align-text@0.1.4": {
        "map": {
          "kind-of": "npm:kind-of@3.2.2",
          "longest": "npm:longest@1.0.1",
          "repeat-string": "npm:repeat-string@1.6.1"
        }
      },
      "npm:is-glob@2.0.1": {
        "map": {
          "is-extglob": "npm:is-extglob@1.0.0"
        }
      },
      "npm:extglob@0.3.2": {
        "map": {
          "is-extglob": "npm:is-extglob@1.0.0"
        }
      },
      "npm:fb-watchman@2.0.0": {
        "map": {
          "bser": "npm:bser@2.0.0"
        }
      },
      "npm:supports-color@3.2.3": {
        "map": {
          "has-flag": "npm:has-flag@1.0.0"
        }
      },
      "npm:jest-environment-node@19.0.2": {
        "map": {
          "jest-mock": "npm:jest-mock@19.0.0",
          "jest-util": "npm:jest-util@19.0.2"
        }
      },
      "npm:pretty-format@19.0.0": {
        "map": {
          "ansi-styles": "npm:ansi-styles@3.2.0"
        }
      },
      "npm:istanbul-reports@1.1.2": {
        "map": {
          "handlebars": "npm:handlebars@4.0.10"
        }
      },
      "npm:find-up@1.1.2": {
        "map": {
          "path-exists": "npm:path-exists@2.1.0",
          "pinkie-promise": "npm:pinkie-promise@2.0.1"
        }
      },
      "npm:js-yaml@3.10.0": {
        "map": {
          "argparse": "npm:argparse@1.0.9",
          "esprima": "npm:esprima@4.0.0"
        }
      },
      "npm:regex-cache@0.4.4": {
        "map": {
          "is-equal-shallow": "npm:is-equal-shallow@0.1.3"
        }
      },
      "npm:handlebars@4.0.10": {
        "map": {
          "async": "npm:async@1.5.2",
          "source-map": "npm:source-map@0.4.4",
          "optimist": "npm:optimist@0.6.1"
        }
      },
      "npm:fb-watchman@1.9.2": {
        "map": {
          "bser": "npm:bser@1.0.2"
        }
      },
      "npm:test-exclude@4.1.1": {
        "map": {
          "micromatch": "npm:micromatch@2.3.11",
          "object-assign": "npm:object-assign@4.1.1",
          "read-pkg-up": "npm:read-pkg-up@1.0.1",
          "require-main-filename": "npm:require-main-filename@1.0.1",
          "arrify": "npm:arrify@1.0.1"
        }
      },
      "npm:read-pkg@1.1.0": {
        "map": {
          "load-json-file": "npm:load-json-file@1.1.0",
          "path-type": "npm:path-type@1.1.0",
          "normalize-package-data": "npm:normalize-package-data@2.4.0"
        }
      },
      "npm:kind-of@3.2.2": {
        "map": {
          "is-buffer": "npm:is-buffer@1.1.5"
        }
      },
      "npm:expand-brackets@0.1.5": {
        "map": {
          "is-posix-bracket": "npm:is-posix-bracket@0.1.1"
        }
      },
      "npm:append-transform@0.4.0": {
        "map": {
          "default-require-extensions": "npm:default-require-extensions@1.0.0"
        }
      },
      "npm:find-up@2.1.0": {
        "map": {
          "locate-path": "npm:locate-path@2.0.0"
        }
      },
      "npm:babel-code-frame@6.26.0": {
        "map": {
          "chalk": "npm:chalk@1.1.3",
          "esutils": "npm:esutils@2.0.2",
          "js-tokens": "npm:js-tokens@3.0.2"
        }
      },
      "npm:object.omit@2.0.1": {
        "map": {
          "for-own": "npm:for-own@0.1.5",
          "is-extendable": "npm:is-extendable@0.1.1"
        }
      },
      "npm:braces@1.8.5": {
        "map": {
          "preserve": "npm:preserve@0.2.0",
          "repeat-element": "npm:repeat-element@1.1.2",
          "expand-range": "npm:expand-range@1.8.2"
        }
      },
      "npm:normalize-path@2.1.1": {
        "map": {
          "remove-trailing-separator": "npm:remove-trailing-separator@1.1.0"
        }
      },
      "npm:browser-resolve@1.11.2": {
        "map": {
          "resolve": "npm:resolve@1.1.7"
        }
      },
      "npm:path-exists@2.1.0": {
        "map": {
          "pinkie-promise": "npm:pinkie-promise@2.0.1"
        }
      },
      "npm:babel-messages@6.23.0": {
        "map": {
          "babel-runtime": "npm:babel-runtime@6.26.0"
        }
      },
      "npm:arr-diff@2.0.0": {
        "map": {
          "arr-flatten": "npm:arr-flatten@1.1.0"
        }
      },
      "npm:detect-indent@4.0.0": {
        "map": {
          "repeating": "npm:repeating@2.0.1"
        }
      },
      "npm:anymatch@1.3.2": {
        "map": {
          "micromatch": "npm:micromatch@2.3.11",
          "normalize-path": "npm:normalize-path@2.1.1"
        }
      },
      "npm:glob-base@0.3.0": {
        "map": {
          "is-glob": "npm:is-glob@2.0.1",
          "glob-parent": "npm:glob-parent@2.0.0"
        }
      },
      "npm:resolve@1.4.0": {
        "map": {
          "path-parse": "npm:path-parse@1.0.5"
        }
      },
      "npm:normalize-package-data@2.4.0": {
        "map": {
          "semver": "npm:semver@5.4.1",
          "is-builtin-module": "npm:is-builtin-module@1.0.0",
          "validate-npm-package-license": "npm:validate-npm-package-license@3.0.1",
          "hosted-git-info": "npm:hosted-git-info@2.5.0"
        }
      },
      "npm:load-json-file@1.1.0": {
        "map": {
          "strip-bom": "npm:strip-bom@2.0.0",
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "pinkie-promise": "npm:pinkie-promise@2.0.1",
          "pify": "npm:pify@2.3.0",
          "parse-json": "npm:parse-json@2.2.0"
        }
      },
      "npm:path-type@1.1.0": {
        "map": {
          "graceful-fs": "npm:graceful-fs@4.1.11",
          "pinkie-promise": "npm:pinkie-promise@2.0.1",
          "pify": "npm:pify@2.3.0"
        }
      },
      "npm:babel-core@6.26.0": {
        "map": {
          "babel-messages": "npm:babel-messages@6.23.0",
          "lodash": "npm:lodash@4.17.4",
          "minimatch": "npm:minimatch@3.0.4",
          "path-is-absolute": "npm:path-is-absolute@1.0.1",
          "slash": "npm:slash@1.0.0",
          "babel-code-frame": "npm:babel-code-frame@6.26.0",
          "babel-generator": "npm:babel-generator@6.26.0",
          "babel-runtime": "npm:babel-runtime@6.26.0",
          "babel-template": "npm:babel-template@6.26.0",
          "babel-traverse": "npm:babel-traverse@6.26.0",
          "babel-types": "npm:babel-types@6.26.0",
          "babylon": "npm:babylon@6.18.0",
          "debug": "npm:debug@2.6.9",
          "source-map": "npm:source-map@0.5.7",
          "convert-source-map": "npm:convert-source-map@1.5.0",
          "json5": "npm:json5@0.5.1",
          "private": "npm:private@0.1.7",
          "babel-helpers": "npm:babel-helpers@6.24.1",
          "babel-register": "npm:babel-register@6.26.0"
        }
      },
      "npm:default-require-extensions@1.0.0": {
        "map": {
          "strip-bom": "npm:strip-bom@2.0.0"
        }
      },
      "npm:invariant@2.2.2": {
        "map": {
          "loose-envify": "npm:loose-envify@1.3.1"
        }
      },
      "npm:locate-path@2.0.0": {
        "map": {
          "path-exists": "npm:path-exists@3.0.0",
          "p-locate": "npm:p-locate@2.0.0"
        }
      },
      "npm:ansi-styles@3.2.0": {
        "map": {
          "color-convert": "npm:color-convert@1.9.0"
        }
      },
      "npm:bser@2.0.0": {
        "map": {
          "node-int64": "npm:node-int64@0.4.0"
        }
      },
      "npm:bser@1.0.2": {
        "map": {
          "node-int64": "npm:node-int64@0.4.0"
        }
      },
      "npm:pinkie-promise@2.0.1": {
        "map": {
          "pinkie": "npm:pinkie@2.0.4"
        }
      },
      "npm:exec-sh@0.2.1": {
        "map": {
          "merge": "npm:merge@1.2.0"
        }
      },
      "npm:walker@1.0.7": {
        "map": {
          "makeerror": "npm:makeerror@1.0.11"
        }
      },
      "npm:argparse@1.0.9": {
        "map": {
          "sprintf-js": "npm:sprintf-js@1.0.3"
        }
      },
      "npm:is-equal-shallow@0.1.3": {
        "map": {
          "is-primitive": "npm:is-primitive@2.0.0"
        }
      },
      "npm:source-map@0.4.4": {
        "map": {
          "amdefine": "npm:amdefine@1.0.1"
        }
      },
      "npm:expand-range@1.8.2": {
        "map": {
          "fill-range": "npm:fill-range@2.2.3"
        }
      },
      "npm:repeating@2.0.1": {
        "map": {
          "is-finite": "npm:is-finite@1.0.2"
        }
      },
      "npm:loose-envify@1.3.1": {
        "map": {
          "js-tokens": "npm:js-tokens@3.0.2"
        }
      },
      "npm:optimist@0.6.1": {
        "map": {
          "wordwrap": "npm:wordwrap@0.0.2",
          "minimist": "npm:minimist@0.0.8"
        }
      },
      "npm:glob-parent@2.0.0": {
        "map": {
          "is-glob": "npm:is-glob@2.0.1"
        }
      },
      "npm:jsdom@9.12.0": {
        "map": {
          "request": "npm:request@2.81.0",
          "tough-cookie": "npm:tough-cookie@2.3.3",
          "array-equal": "npm:array-equal@1.0.0",
          "content-type-parser": "npm:content-type-parser@1.0.1",
          "cssom": "npm:cssom@0.3.2",
          "html-encoding-sniffer": "npm:html-encoding-sniffer@1.0.1",
          "symbol-tree": "npm:symbol-tree@3.2.2",
          "whatwg-encoding": "npm:whatwg-encoding@1.0.1",
          "xml-name-validator": "npm:xml-name-validator@2.0.1",
          "abab": "npm:abab@1.0.4",
          "acorn-globals": "npm:acorn-globals@3.1.0",
          "nwmatcher": "npm:nwmatcher@1.4.2",
          "cssstyle": "npm:cssstyle@0.2.37",
          "webidl-conversions": "npm:webidl-conversions@4.0.2",
          "escodegen": "npm:escodegen@1.9.0",
          "sax": "npm:sax@1.2.4",
          "whatwg-url": "npm:whatwg-url@4.8.0",
          "parse5": "npm:parse5@1.5.1",
          "acorn": "npm:acorn@4.0.13"
        }
      },
      "npm:for-own@0.1.5": {
        "map": {
          "for-in": "npm:for-in@1.0.2"
        }
      },
      "npm:strip-bom@2.0.0": {
        "map": {
          "is-utf8": "npm:is-utf8@0.2.1"
        }
      },
      "npm:fill-range@2.2.3": {
        "map": {
          "repeat-element": "npm:repeat-element@1.1.2",
          "repeat-string": "npm:repeat-string@1.6.1",
          "is-number": "npm:is-number@2.1.0",
          "isobject": "npm:isobject@2.1.0",
          "randomatic": "npm:randomatic@1.1.7"
        }
      },
      "npm:is-finite@1.0.2": {
        "map": {
          "number-is-nan": "npm:number-is-nan@1.0.1"
        }
      },
      "npm:babel-register@6.26.0": {
        "map": {
          "lodash": "npm:lodash@4.17.4",
          "mkdirp": "npm:mkdirp@0.5.1",
          "babel-core": "npm:babel-core@6.26.0",
          "babel-runtime": "npm:babel-runtime@6.26.0",
          "core-js": "npm:core-js@2.5.1",
          "home-or-tmp": "npm:home-or-tmp@2.0.0",
          "source-map-support": "npm:source-map-support@0.4.18"
        }
      },
      "npm:babel-helpers@6.24.1": {
        "map": {
          "babel-template": "npm:babel-template@6.26.0",
          "babel-runtime": "npm:babel-runtime@6.26.0"
        }
      },
      "npm:babel-preset-jest@19.0.0": {
        "map": {
          "babel-plugin-jest-hoist": "npm:babel-plugin-jest-hoist@19.0.0"
        }
      },
      "npm:makeerror@1.0.11": {
        "map": {
          "tmpl": "npm:tmpl@1.0.4"
        }
      },
      "npm:is-builtin-module@1.0.0": {
        "map": {
          "builtin-modules": "npm:builtin-modules@1.1.1"
        }
      },
      "npm:color-convert@1.9.0": {
        "map": {
          "color-name": "npm:color-name@1.1.3"
        }
      },
      "npm:html-encoding-sniffer@1.0.1": {
        "map": {
          "whatwg-encoding": "npm:whatwg-encoding@1.0.1"
        }
      },
      "npm:validate-npm-package-license@3.0.1": {
        "map": {
          "spdx-correct": "npm:spdx-correct@1.0.2",
          "spdx-expression-parse": "npm:spdx-expression-parse@1.0.4"
        }
      },
      "npm:escodegen@1.9.0": {
        "map": {
          "esprima": "npm:esprima@3.1.3",
          "esutils": "npm:esutils@2.0.2",
          "optionator": "npm:optionator@0.8.2",
          "estraverse": "npm:estraverse@4.2.0"
        }
      },
      "npm:whatwg-url@4.8.0": {
        "map": {
          "webidl-conversions": "npm:webidl-conversions@3.0.1",
          "tr46": "npm:tr46@0.0.3"
        }
      },
      "npm:parse-json@2.2.0": {
        "map": {
          "error-ex": "npm:error-ex@1.3.1"
        }
      },
      "npm:cssstyle@0.2.37": {
        "map": {
          "cssom": "npm:cssom@0.3.2"
        }
      },
      "npm:acorn-globals@3.1.0": {
        "map": {
          "acorn": "npm:acorn@4.0.13"
        }
      },
      "npm:p-locate@2.0.0": {
        "map": {
          "p-limit": "npm:p-limit@1.1.0"
        }
      },
      "npm:randomatic@1.1.7": {
        "map": {
          "is-number": "npm:is-number@3.0.0",
          "kind-of": "npm:kind-of@4.0.0"
        }
      },
      "npm:is-number@3.0.0": {
        "map": {
          "kind-of": "npm:kind-of@3.2.2"
        }
      },
      "npm:kind-of@4.0.0": {
        "map": {
          "is-buffer": "npm:is-buffer@1.1.5"
        }
      },
      "npm:isobject@2.1.0": {
        "map": {
          "isarray": "npm:isarray@1.0.0"
        }
      },
      "npm:is-number@2.1.0": {
        "map": {
          "kind-of": "npm:kind-of@3.2.2"
        }
      },
      "npm:source-map-support@0.4.18": {
        "map": {
          "source-map": "npm:source-map@0.5.7"
        }
      },
      "npm:home-or-tmp@2.0.0": {
        "map": {
          "os-homedir": "npm:os-homedir@1.0.2",
          "os-tmpdir": "npm:os-tmpdir@1.0.2"
        }
      },
      "npm:whatwg-encoding@1.0.1": {
        "map": {
          "iconv-lite": "npm:iconv-lite@0.4.13"
        }
      },
      "npm:optionator@0.8.2": {
        "map": {
          "wordwrap": "npm:wordwrap@1.0.0",
          "deep-is": "npm:deep-is@0.1.3",
          "levn": "npm:levn@0.3.0",
          "type-check": "npm:type-check@0.3.2",
          "prelude-ls": "npm:prelude-ls@1.1.2",
          "fast-levenshtein": "npm:fast-levenshtein@2.0.6"
        }
      },
      "npm:spdx-correct@1.0.2": {
        "map": {
          "spdx-license-ids": "npm:spdx-license-ids@1.2.2"
        }
      },
      "npm:error-ex@1.3.1": {
        "map": {
          "is-arrayish": "npm:is-arrayish@0.2.1"
        }
      },
      "npm:levn@0.3.0": {
        "map": {
          "type-check": "npm:type-check@0.3.2",
          "prelude-ls": "npm:prelude-ls@1.1.2"
        }
      },
      "npm:type-check@0.3.2": {
        "map": {
          "prelude-ls": "npm:prelude-ls@1.1.2"
        }
      }
    }
  },
  meta: {
    "ga": {
      "scriptLoad": true,
      "exports": "ga",
      "format": "global"
    }
  },
  nodeConfig: {
    "paths": {
      "npm:": "jspm_packages/npm/",
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
    "npm:*.json"
  ],
  map: {
    "assert": "npm:jspm-nodelibs-assert@0.2.0",
    "babel-polyfill": "npm:babel-polyfill@6.26.0",
    "babel-runtime": "npm:babel-runtime@6.26.0",
    "bcrypt-pbkdf": "npm:bcrypt-pbkdf@1.0.1",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.0",
    "child_process": "npm:jspm-nodelibs-child_process@0.2.0",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "dgram": "npm:jspm-nodelibs-dgram@0.2.0",
    "dns": "npm:jspm-nodelibs-dns@0.2.0",
    "ecc-jsbn": "npm:ecc-jsbn@0.1.1",
    "events": "npm:jspm-nodelibs-events@0.2.2",
    "fetch": "npm:whatwg-fetch@1.1.1",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "fsevents": "npm:fsevents@1.1.2",
    "http": "npm:jspm-nodelibs-http@0.2.0",
    "https": "npm:jspm-nodelibs-https@0.2.0",
    "incremental-dom": "npm:incremental-dom@0.5.1",
    "jodid25519": "npm:jodid25519@1.0.2",
    "jsbn": "npm:jsbn@0.1.1",
    "module": "npm:jspm-nodelibs-module@0.2.0",
    "net": "npm:jspm-nodelibs-net@0.2.0",
    "os": "npm:jspm-nodelibs-os@0.2.2",
    "path": "npm:jspm-nodelibs-path@0.2.3",
    "process": "npm:jspm-nodelibs-process@0.2.0",
    "querystring": "npm:jspm-nodelibs-querystring@0.2.2",
    "recordo": "npm:recordo@0.0.6",
    "stream": "npm:jspm-nodelibs-stream@0.2.0",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.0",
    "superb": "npm:superb.js@0.2.16",
    "tls": "npm:jspm-nodelibs-tls@0.2.0",
    "tty": "npm:jspm-nodelibs-tty@0.2.0",
    "tweetnacl": "npm:tweetnacl@0.14.5",
    "url": "npm:jspm-nodelibs-url@0.2.0",
    "util": "npm:jspm-nodelibs-util@0.2.0",
    "vm": "npm:jspm-nodelibs-vm@0.2.0",
    "zlib": "npm:jspm-nodelibs-zlib@0.2.0"
  },
  packages: {
    "npm:ecc-jsbn@0.1.1": {
      "map": {
        "jsbn": "npm:jsbn@0.1.1"
      }
    },
    "npm:bcrypt-pbkdf@1.0.1": {
      "map": {
        "tweetnacl": "npm:tweetnacl@0.14.5"
      }
    },
    "npm:jodid25519@1.0.2": {
      "map": {
        "jsbn": "npm:jsbn@0.1.1"
      }
    },
    "npm:babel-polyfill@6.26.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.26.0",
        "regenerator-runtime": "npm:regenerator-runtime@0.10.5",
        "core-js": "npm:core-js@2.5.1"
      }
    },
    "npm:recordo@0.0.6": {
      "map": {
        "good-listener": "npm:good-listener@1.2.2",
        "clipboard": "npm:clipboard@1.7.1",
        "lodash": "npm:lodash@3.10.1"
      }
    },
    "npm:babel-runtime@6.26.0": {
      "map": {
        "regenerator-runtime": "npm:regenerator-runtime@0.11.0",
        "core-js": "npm:core-js@2.5.1"
      }
    },
    "npm:fsevents@1.1.2": {
      "map": {
        "nan": "npm:nan@2.7.0",
        "node-pre-gyp": "npm:node-pre-gyp@0.6.38"
      }
    },
    "npm:clipboard@1.7.1": {
      "map": {
        "good-listener": "npm:good-listener@1.2.2",
        "select": "npm:select@1.1.2",
        "tiny-emitter": "npm:tiny-emitter@2.0.2"
      }
    },
    "npm:jspm-nodelibs-stream@0.2.0": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:jspm-nodelibs-zlib@0.2.0": {
      "map": {
        "zlib-browserify": "npm:browserify-zlib@0.1.4"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.0": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "npm:jspm-nodelibs-url@0.2.0": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "npm:jspm-nodelibs-crypto@0.2.0": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.1"
      }
    },
    "npm:jspm-nodelibs-http@0.2.0": {
      "map": {
        "http-browserify": "npm:stream-http@2.7.2"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.0": {
      "map": {
        "buffer-browserify": "npm:buffer@4.9.1"
      }
    },
    "npm:good-listener@1.2.2": {
      "map": {
        "delegate": "npm:delegate@3.1.3"
      }
    },
    "npm:node-pre-gyp@0.6.38": {
      "map": {
        "tar-pack": "npm:tar-pack@3.4.0",
        "nopt": "npm:nopt@4.0.1",
        "rc": "npm:rc@1.2.1",
        "npmlog": "npm:npmlog@4.1.2",
        "rimraf": "npm:rimraf@2.6.2",
        "semver": "npm:semver@5.4.1",
        "tar": "npm:tar@2.2.1",
        "hawk": "npm:hawk@3.1.3",
        "mkdirp": "npm:mkdirp@0.5.1",
        "request": "npm:request@2.81.0"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "npm:crypto-browserify@3.11.1": {
      "map": {
        "browserify-sign": "npm:browserify-sign@4.0.4",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "create-hash": "npm:create-hash@1.1.3",
        "inherits": "npm:inherits@2.0.3",
        "randombytes": "npm:randombytes@2.0.5",
        "create-hmac": "npm:create-hmac@1.1.6",
        "pbkdf2": "npm:pbkdf2@3.0.14"
      }
    },
    "npm:stream-http@2.7.2": {
      "map": {
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "builtin-status-codes": "npm:builtin-status-codes@3.0.0",
        "inherits": "npm:inherits@2.0.3",
        "xtend": "npm:xtend@4.0.1",
        "readable-stream": "npm:readable-stream@2.3.3"
      }
    },
    "npm:tar-pack@3.4.0": {
      "map": {
        "rimraf": "npm:rimraf@2.6.2",
        "tar": "npm:tar@2.2.1",
        "uid-number": "npm:uid-number@0.0.6",
        "readable-stream": "npm:readable-stream@2.3.3",
        "once": "npm:once@1.4.0",
        "fstream-ignore": "npm:fstream-ignore@1.0.5",
        "fstream": "npm:fstream@1.0.11",
        "debug": "npm:debug@2.6.9"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.3.3"
      }
    },
    "npm:browserify-sign@4.0.4": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "inherits": "npm:inherits@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.1.0",
        "elliptic": "npm:elliptic@6.4.0",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:create-hash@1.1.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "ripemd160": "npm:ripemd160@2.0.1",
        "cipher-base": "npm:cipher-base@1.0.4",
        "sha.js": "npm:sha.js@2.4.9"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "randombytes": "npm:randombytes@2.0.5",
        "miller-rabin": "npm:miller-rabin@4.0.1",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "randombytes": "npm:randombytes@2.0.5",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.1.0",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:create-hmac@1.1.6": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "inherits": "npm:inherits@2.0.3",
        "ripemd160": "npm:ripemd160@2.0.1",
        "cipher-base": "npm:cipher-base@1.0.4",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "sha.js": "npm:sha.js@2.4.9"
      }
    },
    "npm:pbkdf2@3.0.14": {
      "map": {
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "ripemd160": "npm:ripemd160@2.0.1",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "sha.js": "npm:sha.js@2.4.9"
      }
    },
    "npm:browserify-zlib@0.1.4": {
      "map": {
        "pako": "npm:pako@0.2.9",
        "readable-stream": "npm:readable-stream@2.3.3"
      }
    },
    "npm:npmlog@4.1.2": {
      "map": {
        "console-control-strings": "npm:console-control-strings@1.1.0",
        "set-blocking": "npm:set-blocking@2.0.0",
        "are-we-there-yet": "npm:are-we-there-yet@1.1.4",
        "gauge": "npm:gauge@2.7.4"
      }
    },
    "npm:buffer@4.9.1": {
      "map": {
        "ieee754": "npm:ieee754@1.1.8",
        "isarray": "npm:isarray@1.0.0",
        "base64-js": "npm:base64-js@1.2.1"
      }
    },
    "npm:tar@2.2.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "fstream": "npm:fstream@1.0.11",
        "block-stream": "npm:block-stream@0.0.9"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "browserify-des": "npm:browserify-des@1.0.0",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "browserify-aes": "npm:browserify-aes@1.0.8"
      }
    },
    "npm:readable-stream@2.3.3": {
      "map": {
        "string_decoder": "npm:string_decoder@1.0.3",
        "inherits": "npm:inherits@2.0.3",
        "isarray": "npm:isarray@1.0.0",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "core-util-is": "npm:core-util-is@1.0.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:ripemd160@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "hash-base": "npm:hash-base@2.0.2"
      }
    },
    "npm:nopt@4.0.1": {
      "map": {
        "osenv": "npm:osenv@0.1.4",
        "abbrev": "npm:abbrev@1.1.1"
      }
    },
    "npm:rc@1.2.1": {
      "map": {
        "deep-extend": "npm:deep-extend@0.4.2",
        "minimist": "npm:minimist@1.2.0",
        "strip-json-comments": "npm:strip-json-comments@2.0.1",
        "ini": "npm:ini@1.3.4"
      }
    },
    "npm:mkdirp@0.5.1": {
      "map": {
        "minimist": "npm:minimist@0.0.8"
      }
    },
    "npm:hawk@3.1.3": {
      "map": {
        "sntp": "npm:sntp@1.0.9",
        "cryptiles": "npm:cryptiles@2.0.5",
        "boom": "npm:boom@2.10.1",
        "hoek": "npm:hoek@2.16.3"
      }
    },
    "npm:randombytes@2.0.5": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:string_decoder@1.0.3": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "randombytes": "npm:randombytes@2.0.5",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:parse-asn1@5.1.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.8",
        "create-hash": "npm:create-hash@1.1.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "pbkdf2": "npm:pbkdf2@3.0.14",
        "asn1.js": "npm:asn1.js@4.9.1"
      }
    },
    "npm:cipher-base@1.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:evp_bytestokey@1.0.3": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "md5.js": "npm:md5.js@1.3.4"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "elliptic": "npm:elliptic@6.4.0",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:browserify-aes@1.0.8": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        "create-hash": "npm:create-hash@1.1.3",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:rimraf@2.6.2": {
      "map": {
        "glob": "npm:glob@7.1.2"
      }
    },
    "npm:request@2.81.0": {
      "map": {
        "hawk": "npm:hawk@3.1.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "aws-sign2": "npm:aws-sign2@0.6.0",
        "is-typedarray": "npm:is-typedarray@1.0.0",
        "forever-agent": "npm:forever-agent@0.6.1",
        "oauth-sign": "npm:oauth-sign@0.8.2",
        "isstream": "npm:isstream@0.1.2",
        "tunnel-agent": "npm:tunnel-agent@0.6.0",
        "stringstream": "npm:stringstream@0.0.5",
        "json-stringify-safe": "npm:json-stringify-safe@5.0.1",
        "caseless": "npm:caseless@0.12.0",
        "combined-stream": "npm:combined-stream@1.0.5",
        "extend": "npm:extend@3.0.1",
        "http-signature": "npm:http-signature@1.1.1",
        "performance-now": "npm:performance-now@0.2.0",
        "uuid": "npm:uuid@3.1.0",
        "mime-types": "npm:mime-types@2.1.17",
        "form-data": "npm:form-data@2.1.4",
        "aws4": "npm:aws4@1.6.0",
        "har-validator": "npm:har-validator@4.2.1",
        "tough-cookie": "npm:tough-cookie@2.3.3",
        "qs": "npm:qs@6.4.0"
      }
    },
    "npm:are-we-there-yet@1.1.4": {
      "map": {
        "readable-stream": "npm:readable-stream@2.3.3",
        "delegates": "npm:delegates@1.0.0"
      }
    },
    "npm:sha.js@2.4.9": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:miller-rabin@4.0.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.8",
        "brorand": "npm:brorand@1.1.0"
      }
    },
    "npm:fstream-ignore@1.0.5": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "fstream": "npm:fstream@1.0.11",
        "minimatch": "npm:minimatch@3.0.4"
      }
    },
    "npm:fstream@1.0.11": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "mkdirp": "npm:mkdirp@0.5.1",
        "rimraf": "npm:rimraf@2.6.2",
        "graceful-fs": "npm:graceful-fs@4.1.11"
      }
    },
    "npm:gauge@2.7.4": {
      "map": {
        "console-control-strings": "npm:console-control-strings@1.1.0",
        "has-unicode": "npm:has-unicode@2.0.1",
        "wide-align": "npm:wide-align@1.1.2",
        "aproba": "npm:aproba@1.2.0",
        "string-width": "npm:string-width@1.0.2",
        "object-assign": "npm:object-assign@4.1.1",
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "signal-exit": "npm:signal-exit@3.0.2"
      }
    },
    "npm:glob@7.1.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "once": "npm:once@1.4.0",
        "fs.realpath": "npm:fs.realpath@1.0.0",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "inflight": "npm:inflight@1.0.6",
        "minimatch": "npm:minimatch@3.0.4"
      }
    },
    "npm:block-stream@0.0.9": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:hash-base@2.0.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:sntp@1.0.9": {
      "map": {
        "hoek": "npm:hoek@2.16.3"
      }
    },
    "npm:elliptic@6.4.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.8",
        "brorand": "npm:brorand@1.1.0",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
        "hmac-drbg": "npm:hmac-drbg@1.0.1",
        "hash.js": "npm:hash.js@1.1.3"
      }
    },
    "npm:osenv@0.1.4": {
      "map": {
        "os-tmpdir": "npm:os-tmpdir@1.0.2",
        "os-homedir": "npm:os-homedir@1.0.2"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:cryptiles@2.0.5": {
      "map": {
        "boom": "npm:boom@2.10.1"
      }
    },
    "npm:once@1.4.0": {
      "map": {
        "wrappy": "npm:wrappy@1.0.2"
      }
    },
    "npm:md5.js@1.3.4": {
      "map": {
        "hash-base": "npm:hash-base@3.0.4",
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:debug@2.6.9": {
      "map": {
        "ms": "npm:ms@2.0.0"
      }
    },
    "npm:hash-base@3.0.4": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:boom@2.10.1": {
      "map": {
        "hoek": "npm:hoek@2.16.3"
      }
    },
    "npm:tunnel-agent@0.6.0": {
      "map": {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:wide-align@1.1.2": {
      "map": {
        "string-width": "npm:string-width@1.0.2"
      }
    },
    "npm:tough-cookie@2.3.3": {
      "map": {
        "punycode": "npm:punycode@1.4.1"
      }
    },
    "npm:asn1.js@4.9.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.8",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:string-width@1.0.2": {
      "map": {
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "code-point-at": "npm:code-point-at@1.1.0",
        "is-fullwidth-code-point": "npm:is-fullwidth-code-point@1.0.0"
      }
    },
    "npm:hash.js@1.1.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:hmac-drbg@1.0.1": {
      "map": {
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
        "hash.js": "npm:hash.js@1.1.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:inflight@1.0.6": {
      "map": {
        "once": "npm:once@1.4.0",
        "wrappy": "npm:wrappy@1.0.2"
      }
    },
    "npm:form-data@2.1.4": {
      "map": {
        "combined-stream": "npm:combined-stream@1.0.5",
        "mime-types": "npm:mime-types@2.1.17",
        "asynckit": "npm:asynckit@0.4.0"
      }
    },
    "npm:mime-types@2.1.17": {
      "map": {
        "mime-db": "npm:mime-db@1.30.0"
      }
    },
    "npm:combined-stream@1.0.5": {
      "map": {
        "delayed-stream": "npm:delayed-stream@1.0.0"
      }
    },
    "npm:minimatch@3.0.4": {
      "map": {
        "brace-expansion": "npm:brace-expansion@1.1.8"
      }
    },
    "npm:http-signature@1.1.1": {
      "map": {
        "assert-plus": "npm:assert-plus@0.2.0",
        "sshpk": "npm:sshpk@1.13.1",
        "jsprim": "npm:jsprim@1.4.1"
      }
    },
    "npm:strip-ansi@3.0.1": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.1.1"
      }
    },
    "npm:har-validator@4.2.1": {
      "map": {
        "har-schema": "npm:har-schema@1.0.5",
        "ajv": "npm:ajv@4.11.8"
      }
    },
    "npm:jsprim@1.4.1": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0",
        "json-schema": "npm:json-schema@0.2.3",
        "extsprintf": "npm:extsprintf@1.3.0",
        "verror": "npm:verror@1.10.0"
      }
    },
    "npm:sshpk@1.13.1": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0",
        "dashdash": "npm:dashdash@1.14.1",
        "getpass": "npm:getpass@0.1.7",
        "asn1": "npm:asn1@0.2.3"
      }
    },
    "npm:brace-expansion@1.1.8": {
      "map": {
        "concat-map": "npm:concat-map@0.0.1",
        "balanced-match": "npm:balanced-match@1.0.0"
      }
    },
    "npm:is-fullwidth-code-point@1.0.0": {
      "map": {
        "number-is-nan": "npm:number-is-nan@1.0.1"
      }
    },
    "npm:json-stable-stringify@1.0.1": {
      "map": {
        "jsonify": "npm:jsonify@0.0.0"
      }
    },
    "npm:dashdash@1.14.1": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0"
      }
    },
    "npm:getpass@0.1.7": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0"
      }
    },
    "npm:verror@1.10.0": {
      "map": {
        "assert-plus": "npm:assert-plus@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "extsprintf": "npm:extsprintf@1.3.0"
      }
    },
    "npm:ajv@4.11.8": {
      "map": {
        "json-stable-stringify": "npm:json-stable-stringify@1.0.1",
        "co": "npm:co@4.6.0"
      }
    }
  }
});
