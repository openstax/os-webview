import type {FlagValue} from '~/helpers/posthog';

export const NAV_PRODUCTS_LABEL_FLAG = 'nav-products-label';

/** Stable CMS `key` of the dropdown under the Products/Tools A/B.
 *  CONFIRM this matches the `key` set on that dropdown in Wagtail. */
export const PRODUCTS_DROPDOWN_KEY = 'products-dropdown';
const TOOLS_LABEL = 'Tools';

// snake_case to match the oxmenus API, as with `partial_url`.
export type FlagAwareNode = {
    key?: string;
    feature_flag?: string;
    flag_value?: string;
};

// Flagged nodes appear only once PostHog resolves, so anything that must paint
// immediately is authored without a feature_flag.
export function isNodeVisible(
    node: FlagAwareNode,
    getVariant: (flag: string) => FlagValue
): boolean {
    const flag = node.feature_flag;

    if (!flag) {
        return true;
    }
    const variant = getVariant(flag);

    if (node.flag_value) {
        return variant !== undefined && String(variant) === node.flag_value;
    }
    return Boolean(variant);
}

/** A/B label swap for the Products dropdown, keyed by stable `key`
 *  (not the display label, so editors can rename freely). */
export function dropdownLabel(
    node: {key?: string; name?: string},
    productsVariant: FlagValue
): string {
    if (node.key === PRODUCTS_DROPDOWN_KEY && productsVariant === 'tools') {
        return TOOLS_LABEL;
    }
    return node.name ?? '';
}

// True when any node in the (possibly nested) menu structure is flag-gated.
export function hasFlaggedNodes(structure: unknown): boolean {
    if (!Array.isArray(structure)) {
        return false;
    }
    return structure.some(
        (node: FlagAwareNode & {menu?: unknown}) =>
            Boolean(node.feature_flag) || hasFlaggedNodes(node.menu)
    );
}
