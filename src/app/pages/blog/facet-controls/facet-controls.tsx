import React from 'react';
import useBlogSearchParams from '../use-blog-search-params';
import './facet-controls.scss';

type NamedSnippet = {id?: number; name: string};

function SubjectChips({subjects}: {subjects: NamedSnippet[]}) {
    const {subjects: active, setParam} = useBlogSearchParams();
    const toggle = (name: string) => {
        const next = active.includes(name)
            ? active.filter((s) => s !== name)
            : [...active, name];

        setParam('subjects', next);
    };

    return (
        <div className="facet-group" role="group" aria-label="Filter by subject">
            {subjects.map((s) => (
                <button
                    key={s.name}
                    type="button"
                    className="facet-chip"
                    aria-pressed={active.includes(s.name)}
                    onClick={() => toggle(s.name)}
                >
                    {s.name}
                </button>
            ))}
        </div>
    );
}

function CollectionSelect({collections}: {collections: NamedSnippet[]}) {
    const {collection, setParam} = useBlogSearchParams();

    return (
        <label className="facet-select" htmlFor="blog-collection-select">
            <span className="facet-label">Collection</span>
            <select
                id="blog-collection-select"
                value={collection ?? ''}
                onChange={(e) => setParam('collection', e.currentTarget.value)}
            >
                <option value="">All collections</option>
                {collections.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                ))}
            </select>
        </label>
    );
}

const SORT_OPTIONS = [
    {key: 'relevance', label: 'Relevance', value: undefined},
    {key: 'newest', label: 'Newest', value: 'newest'}
] as const;

function SortToggle() {
    const {sort, setParam} = useBlogSearchParams();
    const onKeyDown = (e: React.KeyboardEvent) => {
        const delta = ({ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1} as
            Record<string, number>)[e.key];

        if (!delta) {
            return;
        }
        e.preventDefault();
        const current = SORT_OPTIONS.findIndex((o) => o.key === sort);
        const next = SORT_OPTIONS[(current + delta + SORT_OPTIONS.length) % SORT_OPTIONS.length];

        setParam('sort', next.value);
    };

    return (
        <div className="facet-sort-wrap">
            <span className="facet-label" id="blog-sort-label">Sort by</span>
            {/* `custom` opts out of the site-wide [role=radiogroup] filter-bar
                styling (see styles/components/filter-buttons.scss), which would
                otherwise stretch this to full viewport width. */}
            <div className="facet-sort custom" role="radiogroup" aria-labelledby="blog-sort-label">
                {SORT_OPTIONS.map((o) => (
                    <button
                        key={o.key}
                        type="button"
                        role="radio"
                        aria-checked={sort === o.key}
                        tabIndex={sort === o.key ? 0 : -1}
                        onClick={() => setParam('sort', o.value)}
                        onKeyDown={onKeyDown}
                    >{o.label}</button>
                ))}
            </div>
        </div>
    );
}

export default function FacetControls({subjects, collections}: {
    subjects: NamedSnippet[];
    collections: NamedSnippet[];
}) {
    return (
        <div className="facet-controls" role="group" aria-label="Filter and sort blog posts">
            <SubjectChips subjects={subjects} />
            <div className="facet-row">
                <CollectionSelect collections={collections} />
                <SortToggle />
            </div>
        </div>
    );
}
