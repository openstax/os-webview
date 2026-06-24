import React from 'react';
import {assertNotNull} from '~/helpers/data';
import './sort-toggle.scss';

const SORT_OPTIONS = [
    {key: 'relevance', label: 'Relevance', value: undefined},
    {key: 'newest', label: 'Newest', value: 'newest'}
] as const;

type SortValue = 'relevance' | 'newest';

interface SortToggleProps {
    sort: SortValue;
    setSort: (value: 'newest' | undefined) => void;
    labelId: string;
    className?: string;
}

export default function SortToggle({sort, setSort, labelId, className = ''}: SortToggleProps) {
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

        setSort(next.value);

        const group = assertNotNull(e.currentTarget.parentElement);
        const buttons = Array.from(
            group.querySelectorAll<HTMLButtonElement>('button[role="radio"]')
        );

        buttons[nextIndex]?.focus();
    };

    return (
        <div className={`sort-toggle-wrap ${className}`}>
            <span className="sort-toggle-label" id={labelId}>Sort by</span>
            {/* `custom` opts out of the site-wide [role=radiogroup] filter-bar
                styling (see styles/components/filter-buttons.scss), which would
                otherwise stretch this to full viewport width. */}
            <div className="sort-toggle custom" role="radiogroup" aria-labelledby={labelId}>
                {SORT_OPTIONS.map((o) => (
                    <button
                        key={o.key}
                        type="button"
                        role="radio"
                        aria-checked={sort === o.key}
                        tabIndex={sort === o.key ? 0 : -1}
                        onClick={() => setSort(o.value)}
                        onKeyDown={onKeyDown}
                    >{o.label}</button>
                ))}
            </div>
        </div>
    );
}
