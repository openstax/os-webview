import React, {useState, useEffect} from 'react';
import cn from 'classnames';
import {useToggle, useSet} from '~/helpers/data';
import Inputs from './inputs/inputs';
import Filters from './filters/filters';
import ResultBox from './result-box/result-box';
import useResults from './results';
import useMapContext from '../map-context';
import './search-box.scss';
import {AugmentedInfo} from '~/models/query-schools';

/*
When you select school, see if it is in results.
If so, setTheOpenOne to it and scroll to it.
Otherwise, put it in as the sole element of the list
*/

function useTheOpenOne({results}: {results: AugmentedInfo[]}) {
    const [theOpenOne, setTheOpenOne] = useState<AugmentedInfo | null>(null);
    const {map, selectedSchool} = useMapContext();

    useEffect(() => {
        if (selectedSchool) {
            setTheOpenOne(
                results.find((r) => r.pk === selectedSchool.pk) ?? null
            );
            map.showTooltip(selectedSchool);
        } else {
            setTheOpenOne(null);
        }
    }, [map, selectedSchool, results]);

    useEffect(() => {
        setTheOpenOne(results.length === 1 ? results[0] : null);
    }, [results]);

    useEffect(() => {
        if (theOpenOne) {
            map.showPoints([theOpenOne]);
            map.showTooltip(theOpenOne);
        } else if (results.length > 0) {
            map.showPoints(results);
        }
    }, [map, theOpenOne, results]);

    return [theOpenOne, setTheOpenOne] as const;
}

function SearchResults({
    minimized,
    results
}: {
    minimized: boolean;
    results: AugmentedInfo[];
}) {
    const {selectedSchool} = useMapContext();
    const showSelectedSchool = Boolean(results.length < 1 && selectedSchool);
    const resultsOrSchool = React.useMemo(
        () =>
            showSelectedSchool ? [selectedSchool as AugmentedInfo] : results,
        [showSelectedSchool, selectedSchool, results]
    );
    const resultsHidden = resultsOrSchool.length < 1;
    const [theOpenOne, setTheOpenOne] = useTheOpenOne({results});

    return (
        <div
            className="search-results-region"
            hidden={minimized || resultsHidden}
        >
            {resultsOrSchool?.map((school) => (
                <ResultBox
                    model={school}
                    key={school.pk}
                    theOpenOne={theOpenOne}
                    setTheOpenOne={setTheOpenOne}
                />
            ))}
        </div>
    );
}

export default function SearchBox({
    minimized,
    toggle
}: {
    minimized: boolean;
    toggle: () => void;
}) {
    const [searchValue, setSearchValue] = useState('');
    const [filtersHidden, toggleFilters] = useToggle(true);
    const selectedFilters = useSet();
    const [institution, setInstitution] = useState('');
    const [results, searchMessage] = useResults(
        searchValue,
        selectedFilters,
        institution
    );

    return (
        <div className="search-box">
            <div className={cn('top-box', {minimized})}>
                <Inputs
                    {...{
                        searchValue,
                        setSearchValue,
                        toggle,
                        minimized,
                        filtersHidden,
                        toggleFilters
                    }}
                />
            </div>
            {searchMessage && (
                <div className="search-message" hidden={minimized}>
                    {searchMessage}
                </div>
            )}
            <div
                className="filter-settings-region"
                hidden={minimized || filtersHidden}
            >
                <Filters
                    selected={selectedFilters}
                    setInstitution={setInstitution}
                />
            </div>
            {results instanceof Array && (
                <SearchResults {...{minimized, results}} />
            )}
        </div>
    );
}
