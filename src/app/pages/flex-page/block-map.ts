/* eslint-disable camelcase */
import React from 'react';
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {findByType} from '@openstax/flex-page-renderer/utils';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FAQBlock} from './blocks/FAQBlock';
import {BookListBlock} from './blocks/BookListBlock';
import {tableBlockEntry} from './blocks/TableResourceLinksBlock';

// The renderer's html block sets the markup with dangerouslySetInnerHTML, and
// innerHTML never executes <script> tags. RawHTML's `embed` mode re-creates them
// as fresh nodes so JavaScript authored in an html block actually runs.
const HTMLBlock = ({data}: {data: {value: string}}) =>
    React.createElement(RawHTML, {embed: true, html: data.value});

// flex-page-renderer >=1.1.5 expects each block as a {Component, config} pair
// (it reads def.Component at render time). Our local custom blocks still use the
// older "component function + static .blockConfig" shape, so wrap them here.
//
// `table` is overridden to supply resource_ref-marked cells (access-locked
// instructor/student resources) through the renderer's TableCellContext slot,
// so those cells render the real resource-box button (Give dialog +
// trackLink) instead of the CMS's static fallback link. Every other cell,
// and all of sorting/filtering/striping/row-limits, stays the delegate's own
// behavior untouched - see ./blocks/TableResourceLinksBlock.
const composedBlockMap = {
    ...blocks,
    html: {Component: HTMLBlock, config: blocks.html.config},
    faq: {Component: FAQBlock, config: FAQBlock.blockConfig},
    book_list: {Component: BookListBlock, config: BookListBlock.blockConfig},
    table: tableBlockEntry
} as const;

// The literal-typed member is what keeps findByType's Extract-based return type
// from collapsing to `never` for a map handling every block type generically.
type RenderingConditionConfig = Array<
    {type: 'rendering_condition'; value: string | string[]} | {type: string; value: unknown}
>;

// `html`'s value is a plain string, not an object, so a missing config just
// means "no condition" rather than a crash.
function getConditionConfig(data: {value?: unknown}): RenderingConditionConfig | undefined {
    const value = data?.value;

    if (value && typeof value === 'object' && 'config' in value) {
        return (value as {config?: RenderingConditionConfig}).config;
    }
    return undefined;
}

// The CMS field emits a comma-separated string; an array is accepted too so a
// change to that serialization degrades instead of throwing.
function conditionSlugs(condition: string | string[] | undefined): string[] {
    if (!condition) {
        return [];
    }
    const raw = Array.isArray(condition) ? condition : condition.split(',');

    return raw.map((slug) => slug.trim()).filter((slug) => slug.length > 0);
}

// SectionBlock, HeroBlock and CTABlock run this same check internally, so they
// are gated twice; both read the same field the same way and always agree.
function matchesCondition(config: RenderingConditionConfig | undefined, activeConditions: string[] | undefined) {
    const slugs = conditionSlugs(findByType(config, 'rendering_condition')?.value);

    if (slugs.length === 0) {
        return true;
    }
    return slugs.some((slug) => activeConditions?.includes(slug));
}

type GatedBlockProps = {data: {value?: unknown}; activeConditions?: string[]} & Record<string, unknown>;

function withAudienceGate(Component: React.ComponentType<GatedBlockProps>) {
    return function AudienceGatedBlock(props: GatedBlockProps) {
        if (!matchesCondition(getConditionConfig(props.data), props.activeConditions)) {
            return null;
        }
        return React.createElement(Component, props);
    };
}

// Wrapped once at module scope: moving this into a component or hook would
// change component identity every render and remount every block. The cast is
// needed because the ~19 blocks share no common props type; the gate only reads
// `data` and `activeConditions` and forwards the rest untouched.
export const blockMap = Object.fromEntries(
    Object.entries(composedBlockMap).map(([type, def]) => [
        type,
        {
            ...def,
            Component: withAudienceGate(def.Component as unknown as React.ComponentType<GatedBlockProps>)
        }
    ])
) as unknown as typeof composedBlockMap;
