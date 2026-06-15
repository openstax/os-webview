export type Region = 'utility' | 'main' | 'footer';

type FlagMeta = {
    key?: string;
    feature_flag?: string;
    flag_value?: string;
};

export type DropdownNode = FlagMeta & {
    type: 'dropdown';
    region: Region;
    name: string;
    menu: NavNode[];
};

export type LinkNode = FlagMeta & {
    type: 'link';
    region: Region;
    label: string;
    partial_url: string;
};

export type DynamicNode = FlagMeta & {
    type: 'dynamic';
    region: Region;
    component: string;
    label: string;
};

export type NavNode = DropdownNode | LinkNode | DynamicNode;

export function nodesForRegion(
    structure: NavNode[] | null | undefined,
    region: Region
): NavNode[] {
    return (structure ?? []).filter((node) => node.region === region);
}
