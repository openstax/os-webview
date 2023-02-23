module.exports = {
    extends: 'stylelint-config-recommended-scss',
    plugins: ['stylelint-scss'],
    rules: {
        'no-descending-specificity': [
            true,
            {ignore: ['selectors-within-list']}
        ],
        'property-no-unknown' : [
            true,
            {ignoreAtRules: ['supports']}
        ],
        'scss/no-global-function-names': null,
        'no-invalid-position-at-import-rule': null
    }
};
