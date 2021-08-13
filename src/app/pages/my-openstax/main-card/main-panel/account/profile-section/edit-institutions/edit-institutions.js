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

// eslint-disable-next-line complexity
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
    case 'makePrimary':
        return state.map((i) => ({
            ...i,
            primary: i.id === payload.id
        }));
    default:
        throw new Error('scratchReducer: unknown action type');
    }
}

function useScratchInstitutions() {
    const {institutions, primarySchoolId} = useInstitutions();
    const institutionsWithPrimaryFlag = institutions.map((i) => {
        i.primary = i.id === primarySchoolId;
        return i;
    });
    const [data, dispatch] = React.useReducer(scratchReducer, institutionsWithPrimaryFlag);

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

    function makePrimary(event) {
        event.preventDefault();
        dispatch(['makePrimary', institution]);
    }

    return (
        <div className="table-row">
            <div>{institution.name}</div>
            <div>
                <a href="Delete" onClick={doDelete}>
                    Delete this institution
                </a>
                <a href="Primary" onClick={makePrimary}>
                    Make primary
                </a>
            </div>
        </div>
    );
}

function EditInstitutions({onPutAway}) {
    const [institutions, dispatchInstitution] = useScratchInstitutions();
    const {save, setPrimary} = useInstitutions();
    const nonDeletableInstitutions = institutions.filter((i) => i.primary);
    const deletableInstitutions = institutions.filter((i) => !i.primary);

    function onSave() {
        const primaryInstitution = institutions.find((i) => i.primary);

        if (primaryInstitution) {
            setPrimary(primaryInstitution.id);
        }
        save(institutions.map((obj) => obj.id)).then(onPutAway);
    }

    return (
        <div className="edit-institutions">
            <div>
                <div className="table-header">Institution name</div>
                <div className="table-body">
                    {
                        Array.from(nonDeletableInstitutions).map((i) =>
                            <div className="table-row" key={i.name}>
                                <span>{i.name} <b>&bull; Primary</b></span>
                            </div>
                        )
                    }
                    {
                        Array.from(deletableInstitutions).map((i) =>
                            <DeletableRow
                                key={i.id} institution={i} dispatch={dispatchInstitution}
                            />
                        )
                    }
                </div>
            </div>
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
