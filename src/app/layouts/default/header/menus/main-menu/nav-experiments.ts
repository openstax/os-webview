import type {FlagValue} from '~/helpers/posthog';

export const NAV_PRODUCTS_LABEL_FLAG = 'nav-products-label';
export const NAV_K12_ITEM_FLAG = 'nav-k12-item';

/** Stable CMS `key` of the dropdown under the Products/Tools A/B.
 *  CONFIRM this matches the `key` set on that dropdown in Wagtail. */
export const PRODUCTS_DROPDOWN_KEY = 'products-dropdown';
const TOOLS_LABEL = 'Tools';

/** Flag metadata any CMS menu node may carry (snake_case, matching the
 *  oxmenus API — same casing as `partial_url`). */
export type FlagAwareNode = {
    key?: string;
    feature_flag?: string;
    flag_value?: string;
};

/** Generic visibility gate from a node's optional flag metadata.
 *  - no feature_flag     → always visible
 *  - flag_value provided → visible iff String(variant) === flag_value
 *  - flag_value blank    → visible iff the flag is truthy
 *  Nodes gated ON by a flag appear once PostHog's flags resolve (fine for
 *  additive items); author controls/defaults WITHOUT a feature_flag so they
 *  render immediately. */
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
        return String(variant) === node.flag_value;
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
