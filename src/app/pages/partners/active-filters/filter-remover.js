import React from 'react';

export default function FilterRemover({label, store, value}) {
    return (
        <div className="filter-remover">
            <span>{label}</span>
            <button type="button" aria-label="remove" onClick={() => store.toggle(value)}>
                &times;
            </button>
        </div>
    );
}
