import React, { useState } from 'react';
import { Singleselect } from '~/pages/my-openstax/multiselect/multiselect';
import { useStoreon } from 'storeon/preact';
import sfApiFetch from '~/pages/my-openstax/store/sfapi';
import BookSelector from './book-selector';
import cn from 'classnames';
import orderBy from 'lodash/orderBy';
import partition from 'lodash/partition';
import './institution-form.scss';

function RedStar() {
    return (
        <span className='red-star'>*</span>
    );
}

function useMatchingSchoolsNotInAdoptions() {
    const [matches, setMatches] = useState([]);

    function onUpdateFilter(newValue) {
        if (newValue.length > 2) {
            sfApiFetch('schools', `/search/?name=${newValue}`)
                .then((results) => {
                    const options = results.map((r) => ({
                        label: r.name,
                        value: r.salesforce_id
                    }));
                    const lowerValue = newValue.toLowerCase();
                    const [beginsWith, contains] = partition(
                        options,
                        (opt) => opt.label.toLowerCase().startsWith(lowerValue)
                    );

                    setMatches([
                        ...orderBy(beginsWith, 'label'),
                        ...orderBy(contains, 'label')
                    ]);
                });
        }
    }

    return [matches, onUpdateFilter];
}

function SchoolSelector({ initialValue, onChange, disabled }) {
    const [schoolOptions, updateOptions] = useMatchingSchoolsNotInAdoptions();

    return (
        <div className='school-selector'>
            <div className='field-label'>Institution name <RedStar /></div>
            <Singleselect
                initialValue={initialValue}
                options={schoolOptions}
                onChange={onChange}
                autoFocus={!initialValue}
                disabled={disabled}
                onUpdateFilter={updateOptions}
            />
        </div>
    );
}

function DeleteThisInstitution({ school, close }) {
    const { dispatch, account } = useStoreon('account');

    function onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        // eslint-disable-next-line no-alert
        if (window.confirm('Delete all adoptions for this institution?')) {
            dispatch('adoptions/update', {
                accountsId: account.accountsId,
                school,
                books: []
            });
        }
        close();
    }

    // if (!school) {
    //   return null
    // }

    return (
        <a href='/delete' onClick={onClick}>Delete this institution</a>
    );
}

function FormActions({selectedSchool, selectedBooks, close}) {
    const { dispatch, account } = useStoreon('account');
    const saveDisabled = !(selectedSchool && selectedBooks.length);

    function onSave() {
        dispatch('adoptions/update', {
            accountsId: account.accountsId,
            schoolId: selectedSchool.value,
            books: selectedBooks
        });
        close();
    }

    return (
        <div className='actions'>
            <div className='buttons'>
                <button type='button' onClick={close}>Cancel</button>
                <button
                    type='button' className={cn('primary', { disabled: saveDisabled })}
                    onClick={onSave}
                    disabled={saveDisabled}
                >
                    Save
                </button>
            </div>
            <DeleteThisInstitution school={selectedSchool} close={close} />
        </div>
    );
}

// school comes in as an object {id, name}
// selectedSchool should be an object with label and value
export default function InstitutionForm({ school, close }) {
    const selectableSchool = school ? {label: school.name, value: school.id} : null;
    const { adoptions } = useStoreon('adoptions');
    const [selectedSchool, setSelectedSchool] = useState(selectableSchool);
    const adoptionsForSchool = school ?
        adoptions.find((entry) => entry.schoolId === selectedSchool.value) :
        null;
    const initialSelections = adoptionsForSchool ?
        (adoptionsForSchool.books || []).map((b) => ({
            title: { label: b.abbreviation, value: b.abbreviation },
            numStudents: b.numStudents
        })) :
        [];
    const [selectedBooks, setSelectedBooks] = useState(initialSelections);

    return (
        <div className='institution-form'>
            <div className='instructions'>
                <RedStar /> indicates required field
            </div>
            <SchoolSelector
                initialValue={selectedSchool}
                onChange={setSelectedSchool}
                disabled={Boolean(school)}
            />
            <BookSelector {...{ initialSelections, selectedBooks, setSelectedBooks }} />
            <FormActions {...{selectedSchool, selectedBooks, close}} />
        </div>
    );
}
