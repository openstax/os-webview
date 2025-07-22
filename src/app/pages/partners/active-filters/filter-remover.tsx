import React from 'react';
import type {Store} from '../search-context';

export default function FilterRemover({
    label,
    store,
    value
}: {
    label: string;
    store: Store;
    value: string;
}) {
    return (
        <div className="filter-remover">
            <span>{label}</span>
            <button
                type="button"
                data-action="delete"
                onClick={() => store.toggle(value)}
                aria-label={`remove filter for ${label}`}
            >
                &times;
            </button>
        </div>
    );
}
