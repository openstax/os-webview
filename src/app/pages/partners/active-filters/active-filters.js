import React, {useState, useEffect} from 'react';
import FilterRemover from './filter-remover';
import {books, types, advanced, resultCount} from '../store';
import './active-filters.css';

function childPropertiesForStore(store, decoder) {
    if (store.value instanceof Array) {
        return store.value.map((value) => ({
            value,
            store,
            label: decoder ? decoder[value] : value
        }));
    }
    return store.value ? {
        value: store.value,
        store,
        label: decoder ? decoder[value] : store.value
    } : [];
}

function childProperties(advancedFilterDecoder) {
    return childPropertiesForStore(books).concat(
        childPropertiesForStore(types),
        childPropertiesForStore(advanced, advancedFilterDecoder)
    );
}

function clearFilters(event) {
    event.preventDefault();
    books.clear();
    types.clear();
    advanced.clear();
}

export default function ActiveFilters({advancedFilterOptions}) {
    const advancedFilterDecoder = advancedFilterOptions.reduce((a, b) => {
        b.options.forEach((opt) => {
            a[opt.value] = opt.label;
        });
        return a;
    }, {});
    const [cp, setCp] = useState(childProperties(advancedFilterDecoder));

    useEffect(() => {
        const cleanup = [];

        [books, types, advanced, resultCount].forEach((store) =>
            cleanup.push(store.on('notify', () => setCp(childProperties(advancedFilterDecoder))))
        );

        return () => cleanup.forEach((f) => f());
    }, [advancedFilterDecoder]);

    return (
        <div className="active-filters">
            <div className="result-count">{resultCount.value} results</div>
            {
                cp.length > 0 &&
                    <div>
                        <div className="filters">
                            {cp.map((props) => <FilterRemover key={props.value} {...props} />)}
                        </div>
                        <a href="clear" onClick={clearFilters}>Clear All</a>
                    </div>
            }
        </div>
    );
}
