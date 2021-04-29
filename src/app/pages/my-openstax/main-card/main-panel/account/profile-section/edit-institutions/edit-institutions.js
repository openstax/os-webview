import React, {useState} from 'react';
import Dialog from '~/components/dialog/dialog';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import { useStoreon } from 'storeon/preact';
import sfApiFetch from '~/pages/my-openstax/store/sfapi';
import {LabeledElement, FilteringSelect} from '~/components/form-elements/form-elements';
import { AddButton } from '../../../common';
import './edit-institutions.scss';

// Return suggestions, and an onChange that updates suggestions
function useSchoolSuggestions() {
    const [schools, setSchools] = useState([]);
    const onChange = (event) => {
        const value = event.target.value;

        if (value.length > 1) {
            sfApiFetch('schools', `/search?name=${value}`)
                .then((schoolList) => {
                    setSchools(schoolList.map((s) => ({
                        label: s.name,
                        value: s.salesforce_id
                    })));
                });
        } else {
            setSchools([]);
        }
    };

    return [schools, onChange];
}

function scratchReducer(state, [type, payload]) {
    const data = Array.from(state);

    switch (type) {
    case 'add':
        if (!data.some((obj) => obj.id === payload.id)) {
            return [...data, payload];
        }
        // No change
        return state;
    case 'remove':
        return [...data.filter((obj) => obj.id !== payload.id)];
    case 'reset':
        return [...payload];
    default:
        throw new Error('scratchReducer: unknown action type');
    }
}

function useScratchInstitutions() {
    const {user: {institutions}} = useStoreon('user');
    const [data, dispatch] = React.useReducer(scratchReducer, institutions);

    React.useEffect(() => {
        for (const value of institutions) {
            dispatch(['add', value]);
        }
    }, [institutions]);

    return [data, dispatch];
}

function InstitutionInput({dispatch}) {
    const [isOpen, toggle] = useToggle();
    const [schools, onChange] = useSchoolSuggestions();
    const inputRef = React.useRef();
    const accept = (newValue) => {
        const asInstitution = {
            id: newValue.value,
            name: newValue.label
        };

        dispatch(['add', asInstitution]);
        inputRef.current.value = '';
        onChange({target: inputRef.current});
    };

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });

    return isOpen ? (
        <form>
            <LabeledElement label="Institution name">
                <FilteringSelect
                    inputProps={{onChange, ref: inputRef}}
                    options={schools}
                    onChange={accept}
                />
            </LabeledElement>
        </form>
    ) : (
        <AddButton label="Add an institution" onClick={() => toggle()} />
    );
}

function InstitutionRow({institution, dispatch}) {
    function doDelete(event) {
        event.preventDefault();
        dispatch(['remove', institution]);
    }

    return (
        <tr>
            <td>{institution.name}</td>
            <td><a href="Delete" onClick={doDelete}>
                Delete this institution
            </a></td>
        </tr>
    );
}

function EditInstitutions({isOpen, onPutAway}) {
    const [institutions, dispatchInstitution] = useScratchInstitutions();
    const {dispatch, user} = useStoreon('user');

    function onSave() {
        dispatch('user/save', institutions.values());
        onPutAway();
    }

    React.useEffect(() => {
        if (isOpen) {
            dispatchInstitution(['reset', user.institutions]);
        }
    }, [isOpen, dispatchInstitution, user.institutions]);

    return (
        <Dialog
            isOpen={isOpen} onPutAway={onPutAway}
            title="Edit institutions"
        >
            <div className="edit-institutions">
                <table>
                    <thead>
                        <tr>
                            <th>Institution name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.from(institutions).map((i) =>
                                <InstitutionRow
                                    key={i.id} institution={i} dispatch={dispatchInstitution}
                                />
                            )
                        }
                    </tbody>
                </table>
                <InstitutionInput dispatch={dispatchInstitution} />
                <div className="button-row">
                    <button type="button" onClick={() => onPutAway()}>Cancel</button>
                    <button type="button" className="primary" onClick={onSave}>Save</button>
                </div>
            </div>
        </Dialog>
    );
}

export default function EditInstitutionsDialogLink({text}) {
    const [isOpen, toggle] = useToggle();

    function onClick(event) {
        event.preventDefault();
        toggle();
    }

    return (
        <a href={text} className="edit-link" onClick={onClick}>
            {text}
            <EditInstitutions isOpen={isOpen} onPutAway={toggle} />
        </a>
    );
}
