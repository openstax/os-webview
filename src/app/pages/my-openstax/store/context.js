import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import sfApiFetch from '~/models/sfapi';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import uniq from 'lodash/uniq';

// Takes a school entry from sfapi, returns a standard school
function sfSchoolToInstitution(school) {
    return ({
        id: school.salesforce_id,
        name: school.name || '[unknown school]'
    });
}

function useContextValue() {
    const [lists, setLists] = React.useState([]);
    const [schools, setSchools] = React.useState({});
    const decode = React.useCallback(
        (idList) => {
            const toLookUp = uniq(idList)
                .filter((id) => typeof id !== 'undefined' && !(id in schools));

            if (toLookUp.length === 0) {
                return;
            }

            // Put placeholders in the state
            const placeholders = toLookUp.reduce(
                (a, id) => {
                    a[id] = '';
                    return a;
                },
                {}
            );

            setSchools({...schools, ...placeholders});

            // Look them up async
            const promises = toLookUp.map((id) => sfApiFetch('schools', `/${id}`));

            Promise.all(promises).then((results) => {
                const newEntries = results
                    .map(sfSchoolToInstitution)
                    .reduce((a, b) => {
                        a[b.id] = b;
                        return a;
                    }, {});

                setSchools({...schools, ...newEntries});
            });
        },
        [schools]
    );

    React.useEffect(
        () => {
            sfApiFetch('lists')
                .then(camelCaseKeys)
                .then(setLists);
        },
        []
    );

    return {lists, schools, decode};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as MyOpenStaxContextProvider
};
