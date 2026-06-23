import React from 'react';
import useWebinarSearchParams from '../use-webinar-search-params';
import './search-controls.scss';

const SORT_OPTIONS = [
    {key: 'relevance', label: 'Relevance', value: undefined},
    {key: 'newest', label: 'Newest', value: 'newest'}
] as const;

function SortToggle() {
    const {sort, setParam} = useWebinarSearchParams();
    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const delta = ({ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1} as
            Record<string, number>)[e.key];

        if (!delta) {
            return;
        }
        e.preventDefault();
        const current = SORT_OPTIONS.findIndex((o) => o.key === sort);
        const nextIndex = (current + delta + SORT_OPTIONS.length) % SORT_OPTIONS.length;
        const next = SORT_OPTIONS[nextIndex];

        setParam('sort', next.value);

        const group = e.currentTarget.parentElement;
        const buttons = Array.from(
            group?.querySelectorAll<HTMLButtonElement>('button[role="radio"]') ?? []
        );

        buttons[nextIndex]?.focus();
    };

    return (
        <div className="webinar-sort-wrap">
            <span className="webinar-sort-label" id="webinar-sort-label">Sort by</span>
            <div className="webinar-sort custom" role="radiogroup" aria-labelledby="webinar-sort-label">
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

export default function SearchControls() {
    return (
        <div className="webinar-search-controls">
            <SortToggle />
        </div>
    );
}
