import React from 'react';
import FilterRemover from './filter-remover';
import useSearchContext from '../search-context';
import './active-filters.scss';

// *** Might want to eliminate this and just build it into the FilterRemover
function childPropertiesForStore(store, decoder) {
    if (store.value instanceof Array) {
        return store.value.map((value) => ({
            value,
            store,
            label: decoder ? decoder[value] : value
        }));
    }
    return store.value ? [{
        value: store.value,
        store,
        label: decoder ? decoder[store.value] : store.value
    }] : [];
}

export default function ActiveFilters({advancedFilterOptions}) {
    const {books, types, advanced, resultCount} = useSearchContext();
    const advancedFilterDecoder = React.useMemo(
        () => advancedFilterOptions.reduce((a, b) => {
            b.options.forEach((opt) => {
                a[opt.value] = opt.label;
            });
            return a;
        }, {}),
        [advancedFilterOptions]
    );
    const clearAll = React.useCallback(
        (event) => {
            event.preventDefault();
            for (const s of [books, types, advanced]) {
                s.clear();
            }
        },
        [books, types, advanced]
    );
    const cp = React.useMemo(
        () => [
            ...childPropertiesForStore(books),
            ...childPropertiesForStore(types),
            ...childPropertiesForStore(advanced, advancedFilterDecoder)
        ],
        [books, types, advanced, advancedFilterDecoder]
    );

    return (
        <div className="active-filters">
            <div className="result-count">{resultCount.value} results</div>
            {
                cp.length > 0 &&
                    <div>
                        <div className="filters">
                            {cp.map((props) => <FilterRemover key={props.value} {...props} />)}
                        </div>
                        <a href="clear" onClick={clearAll}>Clear All</a>
                    </div>
            }
        </div>
    );
}
