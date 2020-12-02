import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import {useToggle, useSet} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Inputs from './inputs/inputs';
import Filters from './filters/filters';
import ResultBox from './result-box/result-box';
import useResults from './results';
import './search-box.css';

/*
When you select school, see if it is in results.
If so, setTheOpenOne to it and scroll to it.
Otherwise, put it in as the sole element of the list
*/

function useTheOpenOne({map, selectedSchool, results}) {
    const [theOpenOne, setTheOpenOne] = useState();

    useEffect(() => {
        if (selectedSchool) {
            setTheOpenOne(results.find((r) => r.pk === selectedSchool.pk));
            map && map.showTooltip(selectedSchool);
        } else {
            setTheOpenOne(null);
        }
    }, [selectedSchool, results]);
    useEffect(() => {
        setTheOpenOne(results.length === 1 ? results[0] : null);
    }, [results]);

    if (map) {
        if (theOpenOne) {
            map.showPoints([theOpenOne]);
            map.showTooltip(theOpenOne);
        } else if (results.length > 0) {
            map.showPoints(results);
        }
    }

    return [theOpenOne, setTheOpenOne];
}

function SearchResults({minimized, map, results=[], selectedSchool}) {
    const showSelectedSchool = results.length < 1 && selectedSchool;
    const resultsOrSchool = showSelectedSchool ? [selectedSchool] : results;
    const resultsHidden = resultsOrSchool.length < 1;
    const [theOpenOne, setTheOpenOne] = useTheOpenOne({map, selectedSchool, results});

    return (
        <div className="search-results-region" hidden={minimized || resultsHidden}>
            {
                resultsOrSchool && resultsOrSchool.map((school) =>
                    <ResultBox
                        model={school} totalCount={resultsOrSchool.length} key={school.pk}
                        theOpenOne={theOpenOne} setTheOpenOne={setTheOpenOne}
                    />
                )
            }
        </div>
    );
}

export default function SearchBox({map, minimized, toggle, selectedSchool}) {
    const [searchValue, setSearchValue] = useState('');
    const [filtersHidden, toggleFilters] = useToggle(true);
    const selectedFilters = useSet();
    const [institution, setInstitution] = useState('');
    const [results, searchMessage] = useResults(searchValue, selectedFilters, institution);

    return (
        <div className="search-box">
            <div className={cn('top-box', {minimized})}>
                <Inputs {...{searchValue, setSearchValue, toggle, minimized, filtersHidden, toggleFilters}} />
            </div>
            {
                searchMessage &&
                    <div className="search-message" hidden={minimized}>
                        {searchMessage}
                    </div>
            }
            <div className="filter-settings-region" hidden={minimized || filtersHidden}>
                <Filters selected={selectedFilters} setInstitution={setInstitution} />
            </div>
            <SearchResults {...{minimized, map, results, selectedSchool}} />
        </div>
    );
}
