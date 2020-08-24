import React, {useState, useEffect} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import ResultGrid from './result-grid';
import {books, types, advanced, sort, resultCount} from '../store';
import shuffle from 'lodash/shuffle';
import orderBy from 'lodash/orderBy';
import './results.css';

export const costOptions = [
    'Free - $10',
    '$11 - $25',
    '$26 - $40',
    '> $40'
].map((label) => ({
    label,
    value: label.replace(/ /g, '')
}));

const costOptionValues = costOptions.map((entry) => entry.value);

// eslint-disable-next-line complexity
function filterEntries(entries) {
    let result = entries;

    if (books.value.length > 0) {
        result = result.filter((entry) => {
            return entry.books.find((title) => books.includes(title));
        });
    }

    if (types.value) {
        result = result.filter((entry) => {
            return types.value === entry.type;
        });
    }

    if (advanced.value.length > 0) {
        result = result.filter((entry) => {
            return advanced.value
                .filter((feature) => !costOptionValues.includes(feature))
                .every((requiredFeature) => {
                    return entry.advancedFeatures.includes(requiredFeature);
                });
        });
        const costFeatures = advanced.value
            .filter((feature) => costOptionValues.includes(feature));

        if (costFeatures.length) {
            result = result.filter((entry) => {
                return costFeatures.some((costPossibility) => entry.cost === costPossibility);
            });
        }
    }

    resultCount.value = result.length;
    return ['1', '-1'].includes(sort.value) ?
        orderBy(
            result,
            [(entry) => entry.title.toLowerCase()],
            [(sort.value === '-1' ? 'desc' : 'asc')]
        ) :
        shuffle(result);
}

function Results({entries, callback: {onSelect}}) {
    const [filteredEntries, setFilteredEntries] = useState(filterEntries(entries));

    useEffect(() => {
        function handleNotifyFor(store) {
            store.on('notify', () => setFilteredEntries(filterEntries(entries)));
        }

        const cleanup = [books, types, advanced, sort].map(handleNotifyFor);

        return () => cleanup.forEach((fn) => fn());
    }, []);

    return (
        <ResultGrid entries={filteredEntries} emitSelect={onSelect} />
    );
}

const view = {
    classes: ['results']
};

export default pageWrapper(Results, view);
