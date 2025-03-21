import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import formatjs from "eslint-plugin-formatjs";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["src/vendor/**/*.js", "src/settings.js"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended",
), {
    plugins: {
        react,
        "react-hooks": fixupPluginRules(reactHooks),
        formatjs,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            console: "readonly",
            document: "readonly",
            fetch: "readonly",
            history: "readonly",
            piTracker: "readonly",
            pi: "readonly",
            process: "readonly",
            Promise: "readonly",
            Reflect: "readonly",
            require: "readonly",
            window: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 6,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "accessor-pairs": ["error", {
            getWithoutSet: false,
        }],

        "block-scoped-var": "error",
        "comma-dangle": ["error", "never"],
        complexity: ["error", 6],
        "consistent-return": "error",
        curly: ["error", "all"],
        "default-case": "error",
        "dot-location": ["error", "property"],

        "dot-notation": ["error", {
            allowKeywords: true,
        }],

        eqeqeq: "error",
        "global-require": "error",
        "guard-for-in": "error",
        "no-alert": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-div-regex": "error",
        "no-else-return": "error",
        "no-empty-pattern": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-fallthrough": "error",
        "no-floating-decimal": "error",
        "no-implied-eval": "error",
        "no-iterator": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-native-reassign": "error",
        "no-new-wrappers": "error",
        "no-new": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-proto": "error",
        "no-redeclare": "error",
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "error",

        "no-unused-expressions": ["error", {
            allowShortCircuit: true,
            allowTernary: true,
        }],

        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-escape": "error",
        "no-void": "error",

        "no-warning-comments": ["warn", {
            terms: ["fix", "hack", "todo", "xxx"],
            location: "anywhere",
        }],

        "no-with": "error",
        radix: ["error", "always"],
        "vars-on-top": "error",
        "wrap-iife": ["error", "inside"],
        strict: ["error", "never"],
        "no-catch-shadow": "error",
        "no-delete-var": "error",
        "no-label-var": "error",
        "no-shadow-restricted-names": "error",
        "no-shadow": "error",
        "no-undef-init": "error",
        "no-use-before-define": "off",

        "@typescript-eslint/no-use-before-define": ["error", {
            functions: false,
            variables: false,
        }],

        "array-bracket-spacing": ["error", "never"],
        "block-spacing": ["error", "never"],

        "brace-style": ["error", "1tbs", {
            allowSingleLine: true,
        }],

        camelcase: "error",

        "comma-spacing": ["error", {
            before: false,
            after: true,
        }],

        "comma-style": ["error", "last"],
        "computed-property-spacing": ["error", "never"],
        "eol-last": "error",

        "key-spacing": ["error", {
            beforeColon: false,
            afterColon: true,
        }],

        "keyword-spacing": "error",
        "linebreak-style": ["error", "unix"],
        "max-depth": ["error", 4],

        "max-len": ["error", 120, 4, {
            ignoreUrls: true,
        }],

        "max-nested-callbacks": ["error", 3],
        "max-params": ["error", 4],
        "new-cap": "error",
        "new-parens": "error",
        "no-array-constructor": "error",
        "no-implicit-globals": "error",
        "no-lonely-if": "error",
        "no-mixed-spaces-and-tabs": ["error", false],

        "no-multiple-empty-lines": ["error", {
            max: 2,
            maxEOF: 1,
        }],

        "no-nested-ternary": "error",
        "no-new-object": "error",
        "no-spaced-func": "error",
        "no-trailing-spaces": "error",
        "no-whitespace-before-property": "error",
        "one-var": ["error", "never"],
        "operator-linebreak": "off",

        "padded-blocks": ["error", {
            blocks: "never",
            switches: "never",
            classes: "always",
        }],

        "padding-line-between-statements": ["error", {
            blankLine: "always",
            prev: "let",
            next: "*",
        }, {
            blankLine: "always",
            prev: "const",
            next: "*",
        }, {
            blankLine: "any",
            prev: "let",
            next: "let",
        }, {
            blankLine: "any",
            prev: "let",
            next: "const",
        }, {
            blankLine: "any",
            prev: "const",
            next: "let",
        }, {
            blankLine: "any",
            prev: "const",
            next: "const",
        }],

        quotes: ["error", "single", {
            avoidEscape: true,
            allowTemplateLiterals: false,
        }],

        "semi-spacing": ["error", {
            before: false,
            after: true,
        }],

        semi: ["error", "always"],
        "space-before-blocks": ["error", "always"],

        "space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
        }],

        "spaced-comment": ["error", "always", {
            exceptions: ["-*"],
        }],

        "space-in-parens": ["error", "never"],
        "wrap-regex": "error",
        "arrow-parens": ["error", "always"],
        "arrow-spacing": "error",
        "constructor-super": "error",

        "generator-star-spacing": ["error", {
            before: true,
            after: false,
        }],

        "no-class-assign": "error",
        "no-const-assign": "error",
        "no-dupe-class-members": "error",
        "no-duplicate-imports": "error",
        "no-new-symbol": "error",
        "no-this-before-super": "error",
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            varsIgnorePattern: "_",
        }],

        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-var": "error",

        "object-shorthand": ["error", "always", {
            avoidQuotes: true,
        }],

        "prefer-arrow-callback": "error",

        "prefer-const": ["error", {
            destructuring: "any",
            ignoreReadBeforeAssign: false,
        }],

        "prefer-reflect": ["error", {
            exceptions: ["delete"],
        }],

        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "require-yield": "error",
        "rest-spread-spacing": ["error", "never"],
        "template-curly-spacing": ["error", "never"],

        "yield-star-spacing": ["error", {
            before: false,
            after: true,
        }],

        "react/jsx-curly-brace-presence": ["error", "never"],
        "react/jsx-equals-spacing": ["error", "never"],
        "react/jsx-first-prop-new-line": ["error", "multiline"],
        "react/jsx-key": "error",
        "react/jsx-no-target-blank": "error",
        "react/jsx-tag-spacing": "error",
        "react/jsx-uses-vars": "error",
        "react/jsx-uses-react": "error",
        "react/prop-types": "off",
        "react/no-children-prop": "off",

        "react/no-unknown-property": ["error", {
            ignore: ["css"],
        }],
    },
}, {
    files: ["src/**/*.js", "src/**/*.jsx"],
}];