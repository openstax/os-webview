// Mock for ESM-only `color` v5 package used by @openstax/flex-page-renderer.
// Jest 27 can't transform ESM node_modules with .babelrc (file-relative config).
function Color(val) {
    const isDark = () => {
        if (typeof val === 'string' && val.startsWith('#')) {
            const hex = val.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
        }

        return false;
    };

    return {isDark, mix: () => ({isDark})};
}

module.exports = Color;
module.exports.default = Color;
