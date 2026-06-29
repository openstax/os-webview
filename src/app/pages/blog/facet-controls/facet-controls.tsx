import React from 'react';
import useBlogSearchParams from '../use-blog-search-params';
import SortToggle from '~/components/sort-toggle/sort-toggle';
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

export default function FacetControls({subjects, collections}: {
    subjects: NamedSnippet[];
    collections: NamedSnippet[];
}) {
    const {sort, setParam} = useBlogSearchParams();

    return (
        <div className="facet-controls" role="group" aria-label="Filter and sort blog posts">
            <SubjectChips subjects={subjects} />
            <div className="facet-row">
                <CollectionSelect collections={collections} />
                <SortToggle
                    sort={sort}
                    setSort={(value?: string) => setParam('sort', value)}
                    labelId="blog-sort-label"
                    className="facet-sort-position"
                />
            </div>
        </div>
    );
}
