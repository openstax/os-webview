import React, {useState, useEffect} from 'react';
import useDialog from '~/pages/my-openstax/dialog/dialog';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useInstitutions from '~/pages/my-openstax/store/use-institutions';
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
    const {institutions} = useInstitutions();
    const [data, dispatch] = React.useReducer(scratchReducer, institutions);

    useEffect(() => {
        dispatch(['reset', institutions]);
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

    useEffect(() => {
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

function DeletableRow({institution, dispatch}) {
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

function EditInstitutions({onPutAway}) {
    const [institutions, dispatchInstitution] = useScratchInstitutions();
    const {primarySchoolId, save} = useInstitutions();
    const nonDeletableInstitutions = institutions.filter((i) => i.id === primarySchoolId);
    const deletableInstitutions = institutions.filter((i) => i.id !== primarySchoolId);

    function onSave() {
        save(institutions.map((obj) => obj.id)).then(onPutAway);
    }

    return (
        <div className="edit-institutions">
            <table>
                <thead>
                    <tr>
                        <th>Institution name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from(nonDeletableInstitutions).map((i) =>
                            <tr key={i.name}>
                                <td>{i.name}</td>
                                <td />
                            </tr>
                        )
                    }
                    {
                        Array.from(deletableInstitutions).map((i) =>
                            <DeletableRow
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
    );
}

export default function EditInstitutionsDialogLink({text}) {
    const [Dialog, open, close] = useDialog();

    function onClick(e) {
        e.preventDefault();
        open();
    }

    return (
        <a href={text} className="edit-link" onClick={onClick}>
            {text}
            <Dialog title="Edit institutions">
                <EditInstitutions onPutAway={close} />
            </Dialog>
        </a>
    );
}
