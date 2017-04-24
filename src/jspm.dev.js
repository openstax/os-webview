SystemJS.config({
  paths: {
    "~/": "dev/app/"
  },
  map: {
    "jest": "npm:jest@19.0.2",
    "console": "github:jspm/nodelibs-console@0.2.0-alpha",
    "source-map": "npm:source-map@0.2.0",
    "uglify-js": "npm:uglify-js@2.8.22",
    "punycode": "github:jspm/nodelibs-punycode@0.2.0-alpha",
    "uglify-to-browserify": "npm:uglify-to-browserify@1.0.2",
    "element-dataset": "npm:element-dataset@2.2.6"
    "jest-fetch-mock": "npm:jest-fetch-mock@1.0.8"
  },
  packages: {
    "npm:jest@19.0.2": {
      "map": {
        "jest-cli": "npm:jest-cli@19.0.2"
      }
    },
    "npm:jest-cli@19.0.2": {
      "map": {
        "ansi-escapes": "npm:ansi-escapes@1.4.0",
        "is-ci": "npm:is-ci@1.0.10",
        "callsites": "npm:callsites@2.0.0",
        "jest-changed-files": "npm:jest-changed-files@19.0.2",
        "jest-environment-jsdom": "npm:jest-environment-jsdom@19.0.2",
        "jest-regex-util": "npm:jest-regex-util@19.0.0",
        "micromatch": "npm:micromatch@2.3.11",
        "yargs": "npm:yargs@6.6.0",
        "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.0.2",
        "jest-haste-map": "npm:jest-haste-map@19.0.2",
        "istanbul-lib-instrument": "npm:istanbul-lib-instrument@1.7.0",
        "jest-runtime": "npm:jest-runtime@19.0.3",
        "jest-jasmine2": "npm:jest-jasmine2@19.0.2",
        "jest-config": "npm:jest-config@19.0.4",
        "jest-snapshot": "npm:jest-snapshot@19.0.2",
        "which": "npm:which@1.2.14",
        "string-length": "npm:string-length@1.0.1",
        "worker-farm": "npm:worker-farm@1.3.1",
        "chalk": "npm:chalk@1.1.3",
        "jest-util": "npm:jest-util@19.0.2",
        "node-notifier": "npm:node-notifier@5.1.2",
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "jest-resolve-dependencies": "npm:jest-resolve-dependencies@19.0.0",
        "istanbul-api": "npm:istanbul-api@1.1.7",
        "jest-message-util": "npm:jest-message-util@19.0.0",
        "throat": "npm:throat@3.0.0",
        "slash": "npm:slash@1.0.0"
      }
    },
    "npm:jest-environment-jsdom@19.0.2": {
      "map": {
        "jest-util": "npm:jest-util@19.0.2",
        "jest-mock": "npm:jest-mock@19.0.0",
        "jsdom": "npm:jsdom@9.12.0"
      }
    },
    "npm:istanbul-lib-instrument@1.7.0": {
      "map": {
        "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.0.2",
        "babel-generator": "npm:babel-generator@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-types": "npm:babel-types@6.24.1",
        "babylon": "npm:babylon@6.17.0",
        "semver": "npm:semver@5.3.0"
      }
    },
    "npm:jest-jasmine2@19.0.2": {
      "map": {
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "jest-message-util": "npm:jest-message-util@19.0.0",
        "jest-snapshot": "npm:jest-snapshot@19.0.2",
        "jest-matchers": "npm:jest-matchers@19.0.0",
        "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0"
      }
    },
    "npm:jest-snapshot@19.0.2": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "jest-util": "npm:jest-util@19.0.2",
        "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0",
        "jest-diff": "npm:jest-diff@19.0.0",
        "natural-compare": "npm:natural-compare@1.4.0",
        "jest-file-exists": "npm:jest-file-exists@19.0.0",
        "pretty-format": "npm:pretty-format@19.0.0"
      }
    },
    "npm:jest-util@19.0.2": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "jest-message-util": "npm:jest-message-util@19.0.0",
        "jest-mock": "npm:jest-mock@19.0.0",
        "jest-file-exists": "npm:jest-file-exists@19.0.0",
        "leven": "npm:leven@2.1.0",
        "jest-validate": "npm:jest-validate@19.0.2",
        "mkdirp": "npm:mkdirp@0.5.1"
      }
    },
    "npm:node-notifier@5.1.2": {
      "map": {
        "which": "npm:which@1.2.14",
        "semver": "npm:semver@5.3.0",
        "shellwords": "npm:shellwords@0.1.0",
        "growly": "npm:growly@1.3.0"
      }
    },
    "npm:istanbul-api@1.1.7": {
      "map": {
        "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.0.2",
        "istanbul-lib-instrument": "npm:istanbul-lib-instrument@1.7.0",
        "mkdirp": "npm:mkdirp@0.5.1",
        "fileset": "npm:fileset@2.0.3",
        "async": "npm:async@2.3.0",
        "istanbul-lib-report": "npm:istanbul-lib-report@1.0.0",
        "istanbul-lib-hook": "npm:istanbul-lib-hook@1.0.5",
        "istanbul-reports": "npm:istanbul-reports@1.0.2",
        "istanbul-lib-source-maps": "npm:istanbul-lib-source-maps@1.1.1",
        "js-yaml": "npm:js-yaml@3.8.3",
        "once": "npm:once@1.4.0"
      }
    },
    "npm:jest-message-util@19.0.0": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "micromatch": "npm:micromatch@2.3.11"
      }
    },
    "npm:is-ci@1.0.10": {
      "map": {
        "ci-info": "npm:ci-info@1.0.0"
      }
    },
    "npm:micromatch@2.3.11": {
      "map": {
        "expand-brackets": "npm:expand-brackets@0.1.5",
        "braces": "npm:braces@1.8.5",
        "arr-diff": "npm:arr-diff@2.0.0",
        "array-unique": "npm:array-unique@0.2.1",
        "filename-regex": "npm:filename-regex@2.0.0",
        "extglob": "npm:extglob@0.3.2",
        "is-glob": "npm:is-glob@2.0.1",
        "is-extglob": "npm:is-extglob@1.0.0",
        "normalize-path": "npm:normalize-path@2.1.1",
        "object.omit": "npm:object.omit@2.0.1",
        "parse-glob": "npm:parse-glob@3.0.4",
        "kind-of": "npm:kind-of@3.2.0",
        "regex-cache": "npm:regex-cache@0.4.3"
      }
    },
    "npm:yargs@6.6.0": {
      "map": {
        "decamelize": "npm:decamelize@1.2.0",
        "cliui": "npm:cliui@3.2.0",
        "camelcase": "npm:camelcase@3.0.0",
        "read-pkg-up": "npm:read-pkg-up@1.0.1",
        "require-main-filename": "npm:require-main-filename@1.0.1",
        "os-locale": "npm:os-locale@1.4.0",
        "get-caller-file": "npm:get-caller-file@1.0.2",
        "require-directory": "npm:require-directory@2.1.1",
        "which-module": "npm:which-module@1.0.0",
        "y18n": "npm:y18n@3.2.1",
        "yargs-parser": "npm:yargs-parser@4.2.1",
        "set-blocking": "npm:set-blocking@2.0.0",
        "string-width": "npm:string-width@1.0.2"
      }
    },
    "npm:jest-resolve-dependencies@19.0.0": {
      "map": {
        "jest-file-exists": "npm:jest-file-exists@19.0.0"
      }
    },
    "npm:which@1.2.14": {
      "map": {
        "isexe": "npm:isexe@2.0.0"
      }
    },
    "npm:worker-farm@1.3.1": {
      "map": {
        "errno": "npm:errno@0.1.4",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:string-length@1.0.1": {
      "map": {
        "strip-ansi": "npm:strip-ansi@3.0.1"
      }
    },
    "npm:extglob@0.3.2": {
      "map": {
        "is-extglob": "npm:is-extglob@1.0.0"
      }
    },
    "npm:is-glob@2.0.1": {
      "map": {
        "is-extglob": "npm:is-extglob@1.0.0"
      }
    },
    "npm:parse-glob@3.0.4": {
      "map": {
        "is-extglob": "npm:is-extglob@1.0.0",
        "is-glob": "npm:is-glob@2.0.1",
        "glob-base": "npm:glob-base@0.3.0",
        "is-dotfile": "npm:is-dotfile@1.0.2"
      }
    },
    "npm:sane@1.5.0": {
      "map": {
        "fb-watchman": "npm:fb-watchman@1.9.2",
        "walker": "npm:walker@1.0.7",
        "exec-sh": "npm:exec-sh@0.2.0",
        "watch": "npm:watch@0.10.0",
        "anymatch": "npm:anymatch@1.3.0",
        "minimist": "npm:minimist@1.2.0",
        "minimatch": "npm:minimatch@3.0.3"
      }
    },
    "npm:pretty-format@19.0.0": {
      "map": {
        "ansi-styles": "npm:ansi-styles@3.0.0"
      }
    },
    "npm:cliui@3.2.0": {
      "map": {
        "string-width": "npm:string-width@1.0.2",
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "wrap-ansi": "npm:wrap-ansi@2.1.0"
      }
    },
    "npm:yargs-parser@4.2.1": {
      "map": {
        "camelcase": "npm:camelcase@3.0.0"
      }
    },
    "npm:jest-matchers@19.0.0": {
      "map": {
        "jest-diff": "npm:jest-diff@19.0.0",
        "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0",
        "jest-message-util": "npm:jest-message-util@19.0.0",
        "jest-regex-util": "npm:jest-regex-util@19.0.0"
      }
    },
    "npm:jest-matcher-utils@19.0.0": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "pretty-format": "npm:pretty-format@19.0.0"
      }
    },
    "npm:jest-diff@19.0.0": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "jest-matcher-utils": "npm:jest-matcher-utils@19.0.0",
        "pretty-format": "npm:pretty-format@19.0.0",
        "diff": "npm:diff@3.2.0"
      }
    },
    "npm:babel-plugin-istanbul@4.1.1": {
      "map": {
        "istanbul-lib-instrument": "npm:istanbul-lib-instrument@1.7.0",
        "find-up": "npm:find-up@2.1.0",
        "test-exclude": "npm:test-exclude@4.0.3"
      }
    },
    "npm:babel-jest@19.0.0": {
      "map": {
        "babel-core": "npm:babel-core@6.24.1",
        "babel-plugin-istanbul": "npm:babel-plugin-istanbul@4.1.1",
        "babel-preset-jest": "npm:babel-preset-jest@19.0.0"
      }
    },
    "npm:jest-resolve@19.0.2": {
      "map": {
        "jest-haste-map": "npm:jest-haste-map@19.0.2",
        "browser-resolve": "npm:browser-resolve@1.11.2",
        "resolve": "npm:resolve@1.3.3"
      }
    },
    "npm:jest-environment-node@19.0.2": {
      "map": {
        "jest-mock": "npm:jest-mock@19.0.0",
        "jest-util": "npm:jest-util@19.0.2"
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
    "npm:istanbul-lib-report@1.0.0": {
      "map": {
        "supports-color": "npm:supports-color@3.2.3",
        "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.0.2",
        "mkdirp": "npm:mkdirp@0.5.1",
        "path-parse": "npm:path-parse@1.0.5"
      }
    },
    "npm:istanbul-lib-source-maps@1.1.1": {
      "map": {
        "istanbul-lib-coverage": "npm:istanbul-lib-coverage@1.0.2",
        "mkdirp": "npm:mkdirp@0.5.1",
        "source-map": "npm:source-map@0.5.6",
        "rimraf": "npm:rimraf@2.6.1"
      }
    },
    "npm:braces@1.8.5": {
      "map": {
        "repeat-element": "npm:repeat-element@1.1.2",
        "preserve": "npm:preserve@0.2.0",
        "expand-range": "npm:expand-range@1.8.2"
      }
    },
    "npm:arr-diff@2.0.0": {
      "map": {
        "arr-flatten": "npm:arr-flatten@1.0.3"
      }
    },
    "npm:object.omit@2.0.1": {
      "map": {
        "for-own": "npm:for-own@0.1.5",
        "is-extendable": "npm:is-extendable@0.1.1"
      }
    },
    "npm:read-pkg-up@1.0.1": {
      "map": {
        "find-up": "npm:find-up@1.1.2",
        "read-pkg": "npm:read-pkg@1.1.0"
      }
    },
    "npm:fb-watchman@2.0.0": {
      "map": {
        "bser": "npm:bser@2.0.0"
      }
    },
    "npm:os-locale@1.4.0": {
      "map": {
        "lcid": "npm:lcid@1.0.0"
      }
    },
    "npm:jsdom@9.12.0": {
      "map": {
        "content-type-parser": "npm:content-type-parser@1.0.1",
        "array-equal": "npm:array-equal@1.0.0",
        "sax": "npm:sax@1.2.2",
        "cssom": "npm:cssom@0.3.2",
        "cssstyle": "npm:cssstyle@0.2.37",
        "html-encoding-sniffer": "npm:html-encoding-sniffer@1.0.1",
        "webidl-conversions": "npm:webidl-conversions@4.0.1",
        "whatwg-url": "npm:whatwg-url@4.7.1",
        "xml-name-validator": "npm:xml-name-validator@2.0.1",
        "escodegen": "npm:escodegen@1.8.1",
        "acorn": "npm:acorn@4.0.11",
        "symbol-tree": "npm:symbol-tree@3.2.2",
        "nwmatcher": "npm:nwmatcher@1.3.9",
        "parse5": "npm:parse5@1.5.1",
        "abab": "npm:abab@1.0.3",
        "whatwg-encoding": "npm:whatwg-encoding@1.0.1",
        "acorn-globals": "npm:acorn-globals@3.1.0",
        "tough-cookie": "npm:tough-cookie@2.3.2",
        "request": "npm:request@2.81.0"
      }
    },
    "npm:expand-brackets@0.1.5": {
      "map": {
        "is-posix-bracket": "npm:is-posix-bracket@0.1.1"
      }
    },
    "npm:normalize-path@2.1.1": {
      "map": {
        "remove-trailing-separator": "npm:remove-trailing-separator@1.0.1"
      }
    },
    "npm:regex-cache@0.4.3": {
      "map": {
        "is-primitive": "npm:is-primitive@2.0.0",
        "is-equal-shallow": "npm:is-equal-shallow@0.1.3"
      }
    },
    "npm:fileset@2.0.3": {
      "map": {
        "minimatch": "npm:minimatch@3.0.3",
        "glob": "npm:glob@7.1.1"
      }
    },
    "npm:istanbul-lib-hook@1.0.5": {
      "map": {
        "append-transform": "npm:append-transform@0.4.0"
      }
    },
    "npm:istanbul-reports@1.0.2": {
      "map": {
        "handlebars": "npm:handlebars@4.0.6"
      }
    },
    "npm:errno@0.1.4": {
      "map": {
        "prr": "npm:prr@0.0.0"
      }
    },
    "npm:fb-watchman@1.9.2": {
      "map": {
        "bser": "npm:bser@1.0.2"
      }
    },
    "npm:glob-base@0.3.0": {
      "map": {
        "is-glob": "npm:is-glob@2.0.1",
        "glob-parent": "npm:glob-parent@2.0.0"
      }
    },
    "npm:escodegen@1.8.1": {
      "map": {
        "esprima": "npm:esprima@2.7.3",
        "esutils": "npm:esutils@2.0.2",
        "estraverse": "npm:estraverse@1.9.3",
        "optionator": "npm:optionator@0.8.2"
      }
    },
    "npm:browser-resolve@1.11.2": {
      "map": {
        "resolve": "npm:resolve@1.1.7"
      }
    },
    "npm:wrap-ansi@2.1.0": {
      "map": {
        "string-width": "npm:string-width@1.0.2",
        "strip-ansi": "npm:strip-ansi@3.0.1"
      }
    },
    "npm:babel-code-frame@6.22.0": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "esutils": "npm:esutils@2.0.2",
        "js-tokens": "npm:js-tokens@3.0.1"
      }
    },
    "npm:cssstyle@0.2.37": {
      "map": {
        "cssom": "npm:cssom@0.3.2"
      }
    },
    "npm:html-encoding-sniffer@1.0.1": {
      "map": {
        "whatwg-encoding": "npm:whatwg-encoding@1.0.1"
      }
    },
    "npm:is-equal-shallow@0.1.3": {
      "map": {
        "is-primitive": "npm:is-primitive@2.0.0"
      }
    },
    "npm:ansi-styles@3.0.0": {
      "map": {
        "color-convert": "npm:color-convert@1.9.0"
      }
    },
    "npm:test-exclude@4.0.3": {
      "map": {
        "micromatch": "npm:micromatch@2.3.11",
        "read-pkg-up": "npm:read-pkg-up@1.0.1",
        "require-main-filename": "npm:require-main-filename@1.0.1",
        "object-assign": "npm:object-assign@4.1.1",
        "arrify": "npm:arrify@1.0.1"
      }
    },
    "npm:anymatch@1.3.0": {
      "map": {
        "micromatch": "npm:micromatch@2.3.11",
        "arrify": "npm:arrify@1.0.1"
      }
    },
    "npm:babel-messages@6.23.0": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.23.0"
      }
    },
    "npm:handlebars@4.0.6": {
      "map": {
        "async": "npm:async@1.5.2",
        "source-map": "npm:source-map@0.4.4",
        "optimist": "npm:optimist@0.6.1"
      }
    },
    "npm:supports-color@3.2.3": {
      "map": {
        "has-flag": "npm:has-flag@1.0.0"
      }
    },
    "npm:acorn-globals@3.1.0": {
      "map": {
        "acorn": "npm:acorn@4.0.11"
      }
    },
    "npm:find-up@1.1.2": {
      "map": {
        "path-exists": "npm:path-exists@2.1.0",
        "pinkie-promise": "npm:pinkie-promise@2.0.1"
      }
    },
    "npm:find-up@2.1.0": {
      "map": {
        "locate-path": "npm:locate-path@2.0.0"
      }
    },
    "npm:detect-indent@4.0.0": {
      "map": {
        "repeating": "npm:repeating@2.0.1"
      }
    },
    "npm:walker@1.0.7": {
      "map": {
        "makeerror": "npm:makeerror@1.0.11"
      }
    },
    "npm:lcid@1.0.0": {
      "map": {
        "invert-kv": "npm:invert-kv@1.0.0"
      }
    },
    "npm:bser@2.0.0": {
      "map": {
        "node-int64": "npm:node-int64@0.4.0"
      }
    },
    "npm:read-pkg@1.1.0": {
      "map": {
        "load-json-file": "npm:load-json-file@1.1.0",
        "path-type": "npm:path-type@1.1.0",
        "normalize-package-data": "npm:normalize-package-data@2.3.8"
      }
    },
    "npm:exec-sh@0.2.0": {
      "map": {
        "merge": "npm:merge@1.2.0"
      }
    },
    "npm:babel-preset-jest@19.0.0": {
      "map": {
        "babel-plugin-jest-hoist": "npm:babel-plugin-jest-hoist@19.0.0"
      }
    },
    "npm:for-own@0.1.5": {
      "map": {
        "for-in": "npm:for-in@1.0.2"
      }
    },
    "npm:expand-range@1.8.2": {
      "map": {
        "fill-range": "npm:fill-range@2.2.3"
      }
    },
    "npm:whatwg-encoding@1.0.1": {
      "map": {
        "iconv-lite": "npm:iconv-lite@0.4.13"
      }
    },
    "npm:append-transform@0.4.0": {
      "map": {
        "default-require-extensions": "npm:default-require-extensions@1.0.0"
      }
    },
    "npm:argparse@1.0.9": {
      "map": {
        "sprintf-js": "npm:sprintf-js@1.0.3"
      }
    },
    "npm:invariant@2.2.2": {
      "map": {
        "loose-envify": "npm:loose-envify@1.3.1"
      }
    },
    "npm:bser@1.0.2": {
      "map": {
        "node-int64": "npm:node-int64@0.4.0"
      }
    },
    "npm:locate-path@2.0.0": {
      "map": {
        "path-exists": "npm:path-exists@3.0.0",
        "p-locate": "npm:p-locate@2.0.0"
      }
    },
    "npm:glob-parent@2.0.0": {
      "map": {
        "is-glob": "npm:is-glob@2.0.1"
      }
    },
    "npm:path-exists@2.1.0": {
      "map": {
        "pinkie-promise": "npm:pinkie-promise@2.0.1"
      }
    },
    "npm:path-type@1.1.0": {
      "map": {
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "pinkie-promise": "npm:pinkie-promise@2.0.1",
        "pify": "npm:pify@2.3.0"
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
    "npm:source-map@0.2.0": {
      "map": {
        "amdefine": "npm:amdefine@1.0.1"
      }
    },
    "npm:source-map@0.4.4": {
      "map": {
        "amdefine": "npm:amdefine@1.0.1"
      }
    },
    "npm:fill-range@2.2.3": {
      "map": {
        "repeat-element": "npm:repeat-element@1.1.2",
        "randomatic": "npm:randomatic@1.1.6",
        "repeat-string": "npm:repeat-string@1.6.1",
        "is-number": "npm:is-number@2.1.0",
        "isobject": "npm:isobject@2.1.0"
      }
    },
    "npm:color-convert@1.9.0": {
      "map": {
        "color-name": "npm:color-name@1.1.2"
      }
    },
    "npm:default-require-extensions@1.0.0": {
      "map": {
        "strip-bom": "npm:strip-bom@2.0.0"
      }
    },
    "npm:optimist@0.6.1": {
      "map": {
        "minimist": "npm:minimist@0.0.10",
        "wordwrap": "npm:wordwrap@0.0.3"
      }
    },
    "npm:loose-envify@1.3.1": {
      "map": {
        "js-tokens": "npm:js-tokens@3.0.1"
      }
    },
    "npm:repeating@2.0.1": {
      "map": {
        "is-finite": "npm:is-finite@1.0.2"
      }
    },
    "npm:makeerror@1.0.11": {
      "map": {
        "tmpl": "npm:tmpl@1.0.4"
      }
    },
    "npm:optionator@0.8.2": {
      "map": {
        "prelude-ls": "npm:prelude-ls@1.1.2",
        "type-check": "npm:type-check@0.3.2",
        "levn": "npm:levn@0.3.0",
        "wordwrap": "npm:wordwrap@1.0.0",
        "deep-is": "npm:deep-is@0.1.3",
        "fast-levenshtein": "npm:fast-levenshtein@2.0.6"
      }
    },
    "npm:home-or-tmp@2.0.0": {
      "map": {
        "os-tmpdir": "npm:os-tmpdir@1.0.2",
        "os-homedir": "npm:os-homedir@1.0.2"
      }
    },
    "github:jspm/nodelibs-punycode@0.2.0-alpha": {
      "map": {
        "punycode-browserify": "npm:punycode@1.4.1"
      }
    },
    "npm:yargs@3.10.0": {
      "map": {
        "camelcase": "npm:camelcase@1.2.1",
        "cliui": "npm:cliui@2.1.0",
        "decamelize": "npm:decamelize@1.2.0",
        "window-size": "npm:window-size@0.1.0"
      }
    },
    "npm:is-finite@1.0.2": {
      "map": {
        "number-is-nan": "npm:number-is-nan@1.0.1"
      }
    },
    "npm:levn@0.3.0": {
      "map": {
        "prelude-ls": "npm:prelude-ls@1.1.2",
        "type-check": "npm:type-check@0.3.2"
      }
    },
    "npm:type-check@0.3.2": {
      "map": {
        "prelude-ls": "npm:prelude-ls@1.1.2"
      }
    },
    "npm:is-number@2.1.0": {
      "map": {
        "kind-of": "npm:kind-of@3.2.0"
      }
    },
    "npm:randomatic@1.1.6": {
      "map": {
        "is-number": "npm:is-number@2.1.0",
        "kind-of": "npm:kind-of@3.2.0"
      }
    },
    "npm:strip-bom@2.0.0": {
      "map": {
        "is-utf8": "npm:is-utf8@0.2.1"
      }
    },
    "npm:isobject@2.1.0": {
      "map": {
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "npm:is-builtin-module@1.0.0": {
      "map": {
        "builtin-modules": "npm:builtin-modules@1.1.1"
      }
    },
    "npm:validate-npm-package-license@3.0.1": {
      "map": {
        "spdx-expression-parse": "npm:spdx-expression-parse@1.0.4",
        "spdx-correct": "npm:spdx-correct@1.0.2"
      }
    },
    "npm:parse-json@2.2.0": {
      "map": {
        "error-ex": "npm:error-ex@1.3.1"
      }
    },
    "npm:cliui@2.1.0": {
      "map": {
        "wordwrap": "npm:wordwrap@0.0.2",
        "right-align": "npm:right-align@0.1.3",
        "center-align": "npm:center-align@0.1.3"
      }
    },
    "npm:p-locate@2.0.0": {
      "map": {
        "p-limit": "npm:p-limit@1.1.0"
      }
    },
    "npm:error-ex@1.3.1": {
      "map": {
        "is-arrayish": "npm:is-arrayish@0.2.1"
      }
    },
    "npm:spdx-correct@1.0.2": {
      "map": {
        "spdx-license-ids": "npm:spdx-license-ids@1.2.2"
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
    "npm:align-text@0.1.4": {
      "map": {
        "kind-of": "npm:kind-of@3.2.0",
        "repeat-string": "npm:repeat-string@1.6.1",
        "longest": "npm:longest@1.0.1"
      }
    },
    "npm:chalk@1.1.3": {
      "map": {
        "strip-ansi": "npm:strip-ansi@3.0.1",
        "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
        "ansi-styles": "npm:ansi-styles@2.2.1",
        "supports-color": "npm:supports-color@2.0.0",
        "has-ansi": "npm:has-ansi@2.0.0"
      }
    },
    "npm:has-ansi@2.0.0": {
      "map": {
        "ansi-regex": "npm:ansi-regex@2.1.1"
      }
    },
    "npm:pinkie-promise@2.0.1": {
      "map": {
        "pinkie": "npm:pinkie@2.0.4"
      }
    },
    "npm:async@2.3.0": {
      "map": {
        "lodash": "npm:lodash@4.17.4"
      }
    },
    "npm:js-yaml@3.8.3": {
      "map": {
        "argparse": "npm:argparse@1.0.9",
        "esprima": "npm:esprima@3.1.3"
      }
    },
    "npm:uglify-js@2.8.22": {
      "map": {
        "source-map": "npm:source-map@0.5.6",
        "yargs": "npm:yargs@3.10.0"
      }
    },
    "npm:element-dataset@2.2.6": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.23.0"
      }
    },
    "npm:jest-haste-map@19.0.2": {
      "map": {
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "micromatch": "npm:micromatch@2.3.11",
        "worker-farm": "npm:worker-farm@1.3.1",
        "fb-watchman": "npm:fb-watchman@2.0.0",
        "sane": "npm:sane@1.5.0"
      }
    },
    "npm:jest-runtime@19.0.3": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "jest-regex-util": "npm:jest-regex-util@19.0.0",
        "jest-util": "npm:jest-util@19.0.2",
        "micromatch": "npm:micromatch@2.3.11",
        "yargs": "npm:yargs@6.6.0",
        "jest-config": "npm:jest-config@19.0.4",
        "jest-haste-map": "npm:jest-haste-map@19.0.2",
        "babel-core": "npm:babel-core@6.24.1",
        "jest-resolve": "npm:jest-resolve@19.0.2",
        "babel-plugin-istanbul": "npm:babel-plugin-istanbul@4.1.1",
        "strip-bom": "npm:strip-bom@3.0.0",
        "babel-jest": "npm:babel-jest@19.0.0",
        "json-stable-stringify": "npm:json-stable-stringify@1.0.1",
        "jest-file-exists": "npm:jest-file-exists@19.0.0"
      }
    },
    "npm:babel-core@6.24.1": {
      "map": {
        "babel-generator": "npm:babel-generator@6.24.1",
        "babel-template": "npm:babel-template@6.24.1",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babylon": "npm:babylon@6.17.0",
        "debug": "npm:debug@2.6.6",
        "lodash": "npm:lodash@4.17.4",
        "slash": "npm:slash@1.0.0",
        "source-map": "npm:source-map@0.5.6",
        "babel-register": "npm:babel-register@6.24.1",
        "babel-helpers": "npm:babel-helpers@6.24.1",
        "path-is-absolute": "npm:path-is-absolute@1.0.1",
        "json5": "npm:json5@0.5.1",
        "babel-messages": "npm:babel-messages@6.23.0",
        "minimatch": "npm:minimatch@3.0.3",
        "convert-source-map": "npm:convert-source-map@1.5.0",
        "private": "npm:private@0.1.7",
        "babel-code-frame": "npm:babel-code-frame@6.22.0"
      }
    },
    "npm:babel-template@6.24.1": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babylon": "npm:babylon@6.17.0",
        "babel-traverse": "npm:babel-traverse@6.24.1",
        "babel-types": "npm:babel-types@6.24.1",
        "lodash": "npm:lodash@4.17.4"
      }
    },
    "npm:babel-generator@6.24.1": {
      "map": {
        "babel-messages": "npm:babel-messages@6.23.0",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1",
        "detect-indent": "npm:detect-indent@4.0.0",
        "jsesc": "npm:jsesc@1.3.0",
        "trim-right": "npm:trim-right@1.0.1",
        "lodash": "npm:lodash@4.17.4",
        "source-map": "npm:source-map@0.5.6"
      }
    },
    "npm:kind-of@3.2.0": {
      "map": {
        "is-buffer": "npm:is-buffer@1.1.5"
      }
    },
    "npm:babel-types@6.24.1": {
      "map": {
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "to-fast-properties": "npm:to-fast-properties@1.0.2",
        "lodash": "npm:lodash@4.17.4",
        "esutils": "npm:esutils@2.0.2"
      }
    },
    "npm:babel-traverse@6.24.1": {
      "map": {
        "babel-code-frame": "npm:babel-code-frame@6.22.0",
        "babel-messages": "npm:babel-messages@6.23.0",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "babel-types": "npm:babel-types@6.24.1",
        "babylon": "npm:babylon@6.17.0",
        "debug": "npm:debug@2.6.6",
        "globals": "npm:globals@9.17.0",
        "lodash": "npm:lodash@4.17.4",
        "invariant": "npm:invariant@2.2.2"
      }
    },
    "npm:babel-register@6.24.1": {
      "map": {
        "babel-core": "npm:babel-core@6.24.1",
        "core-js": "npm:core-js@2.4.1",
        "lodash": "npm:lodash@4.17.4",
        "mkdirp": "npm:mkdirp@0.5.1",
        "babel-runtime": "npm:babel-runtime@6.23.0",
        "source-map-support": "npm:source-map-support@0.4.15",
        "home-or-tmp": "npm:home-or-tmp@2.0.0"
      }
    },
    "npm:babel-helpers@6.24.1": {
      "map": {
        "babel-template": "npm:babel-template@6.24.1",
        "babel-runtime": "npm:babel-runtime@6.23.0"
      }
    },
    "npm:resolve@1.3.3": {
      "map": {
        "path-parse": "npm:path-parse@1.0.5"
      }
    },
    "npm:whatwg-url@4.7.1": {
      "map": {
        "webidl-conversions": "npm:webidl-conversions@3.0.1",
        "tr46": "npm:tr46@0.0.3"
      }
    },
    "npm:normalize-package-data@2.3.8": {
      "map": {
        "semver": "npm:semver@5.3.0",
        "is-builtin-module": "npm:is-builtin-module@1.0.0",
        "hosted-git-info": "npm:hosted-git-info@2.4.2",
        "validate-npm-package-license": "npm:validate-npm-package-license@3.0.1"
      }
    },
    "npm:jest-config@19.0.4": {
      "map": {
        "chalk": "npm:chalk@1.1.3",
        "jest-environment-jsdom": "npm:jest-environment-jsdom@19.0.2",
        "jest-jasmine2": "npm:jest-jasmine2@19.0.2",
        "jest-regex-util": "npm:jest-regex-util@19.0.0",
        "jest-environment-node": "npm:jest-environment-node@19.0.2",
        "jest-validate": "npm:jest-validate@19.0.2",
        "jest-resolve": "npm:jest-resolve@19.0.2",
        "pretty-format": "npm:pretty-format@19.0.0"
      }
    },
    "npm:source-map-support@0.4.15": {
      "map": {
        "source-map": "npm:source-map@0.5.6"
      }
    },
    "npm:jest-fetch-mock@1.0.8": {
      "map": {
        "whatwg-fetch": "npm:whatwg-fetch@1.0.0"
      }
    }
  }
});
