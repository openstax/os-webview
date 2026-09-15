import type {FlagValue} from '~/helpers/posthog';

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
