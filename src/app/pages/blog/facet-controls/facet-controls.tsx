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
            <span>Collection</span>
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

function SortToggle() {
    const {sort, setParam} = useBlogSearchParams();

    return (
        <div className="facet-sort" role="group" aria-label="Sort">
            <button
                type="button"
                aria-pressed={sort === 'relevance'}
                onClick={() => setParam('sort', 'relevance')}
            >Relevance</button>
            <button
                type="button"
                aria-pressed={sort === 'newest'}
                onClick={() => setParam('sort', 'newest')}
            >Newest</button>
        </div>
    );
}

export default function FacetControls({subjects, collections}: {
    subjects: NamedSnippet[];
    collections: NamedSnippet[];
}) {
    return (
        <div className="facet-controls">
            <SubjectChips subjects={subjects} />
            <CollectionSelect collections={collections} />
            <SortToggle />
        </div>
    );
}
