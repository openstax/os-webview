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

// A literal-typed 'rendering_condition' member alongside a catch-all member is
// what lets findByType's Extract-based return type resolve to something other
// than `never` - every block's config union is really its own specific set of
// literal-tagged options, but this wrapper handles all of them generically.
//
// The CMS field is being converted from free text to a MultipleChoiceBlock,
// whose API representation joins the picked slugs back into the same
// comma-separated string this already expects - but a bare string[] is accepted
// too, so this degrades gracefully if that join is ever dropped.
type RenderingConditionConfig = Array<
    {type: 'rendering_condition'; value: string | string[]} | {type: string; value: unknown}
>;

// Only 3 of ~20 flex-page-renderer block types check `rendering_condition`
// themselves (SectionBlock, HeroBlock, CTABlock). Rather than waiting on a
// flex-pages release to add the check everywhere, every block in this map gets
// wrapped with the same audience gate here.
//
// Not every block's `value` is an object - `html`'s is a plain string - so a
// missing or non-object value just means "no condition", not a crash.
function getConditionConfig(data: {value?: unknown}): RenderingConditionConfig | undefined {
    const value = data?.value;

    if (value && typeof value === 'object' && 'config' in value) {
        return (value as {config?: RenderingConditionConfig}).config;
    }
    return undefined;
}

// Accepts either the comma-separated string the field emits today or a bare
// array of slugs, trims each one, and drops empties either way.
function conditionSlugs(condition: string | string[] | undefined): string[] {
    if (!condition) {
        return [];
    }
    const raw = Array.isArray(condition) ? condition : condition.split(',');

    return raw.map((slug) => slug.trim()).filter((slug) => slug.length > 0);
}

// Same OR semantics the renderer's own SectionBlock/HeroBlock/CTABlock apply: no
// condition set -> always render; condition set -> render if any slug is active.
// Those three blocks end up checked twice (once here, once in their own
// built-in check), but both read the same field the same way, so they always
// agree - the duplicate check is harmless.
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

// Built once at module scope (composedBlockMap is already module-level) so
// wrapped component identity stays stable across renders - do not move this
// inside a component or a hook.
//
// Each block's Component has its own distinct, specific props type (the html
// block's data is a bare string, the table block's is a TableBlockConfig, and so
// on), so there is no single type all ~19 of them share other than this loose
// one. withAudienceGate only ever reads `data` and `activeConditions` off props
// and otherwise forwards them untouched, so the cast is safe at runtime.
export const blockMap = Object.fromEntries(
    Object.entries(composedBlockMap).map(([type, def]) => [
        type,
        {
            ...def,
            Component: withAudienceGate(def.Component as unknown as React.ComponentType<GatedBlockProps>)
        }
    ])
) as unknown as typeof composedBlockMap;
