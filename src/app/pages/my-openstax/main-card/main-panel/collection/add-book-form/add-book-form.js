/* eslint-disable */
import React from 'react';
import { PlusBox, PutAway } from '../../common';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select.jsx';
import {useStyledCheckbox, LabeledElement, ClickForwardingLabel} from '~/components/form-elements/form-elements';
import FormCheckboxgroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import useSalesforceContext from '~/contexts/salesforce';
import useAdoptions from '~/pages/my-openstax/store/use-adoptions';
import useInstitutions from '~/pages/my-openstax/store/use-institutions';
import useBooks from '~/pages/my-openstax/store/use-books';
import useAccount from '~/pages/my-openstax/store/use-account';
import './add-book-form.scss';

function Book({ name }) {
    return (
        <div className='adopted-book card'>
            <div className='cover'>{name}</div>
            <PutAway />
            <a className='btn primary' href='/book'>View book</a>
            <a className='btn' href='/resources'>See resources</a>
        </div>
    );
}

function Institution({name, value, adoption=[]}) {
    const opportunityData = adoption.find((a) => a.schoolId === value);
    const [StyledCheckbox, checked] = useStyledCheckbox(Boolean(opportunityData));
    const childRef = React.useRef();
    const studentLabel = `Number of your students that would use this book at
    the above institution`;

    return (
        <div className="institution-selector">
            <ClickForwardingLabel childIndex="0" childRef={childRef}>
                <StyledCheckbox name="school" value={value} forwardRef={childRef}/>
                {name}
            </ClickForwardingLabel>
            {
                checked &&
                <LabeledElement label={studentLabel}>
                    <input
                        name="students" type="number" min="1" max="999" required
                        defaultValue={opportunityData ? +opportunityData.students : ''}
                    />
                </LabeledElement>
            }
        </div>
    )
}

function InstitutionList({adoption}) {
    const {institutions} = useInstitutions();
    const [validationMessage, setValidationMessage] = React.useState('');
    const ref = React.useRef();

    // Catches any clicks below and validates
    const updateValidation = React.useCallback(
        () => {
            if (!ref.current) {
                return;
            }
            const checked = ref.current.querySelectorAll('[aria-checked="true"]');

            setValidationMessage(checked.length ? '' : 'Check at least one');
        },
        []
    );

    React.useEffect(() => {
        setTimeout(onClick, 80); // Give it time to render children
    }, []);

    return (
        <LabeledElement label="Institution(s) where this book would be used">
            <div className="checkbox-group" onClick={updateValidation} ref={ref}>
                {
                    institutions.map((i) =>
                        <Institution
                            key={i.id} name={i.name} value={i.id}
                            adoption={adoption}
                        />
                    )
                }
            </div>
            <div className="invalid-message">{validationMessage}</div>
        </LabeledElement>
    );
}

function useOptions() {
    const {adoption} = useSalesforceContext();

    return React.useMemo(
        () => adoption(['adopted', 'recommended', 'interest'])
        .map((a) => ({
            label: a.text,
            value: a.value
        })),
        [adoption]
    );
}

function payloadFromFormData(formData, books) {
    const bookMightNeedLookup = formData.get('book');
    const book = books ?
        books.find((b) => bookMightNeedLookup === b.label).value :
        bookMightNeedLookup;
    const payload = {
        id: formData.getAll('id'),
        book,
        adoptionStatus: formData.get('adoptionStatus'),
        schools: formData.getAll('school'),
        students: formData.getAll('students')
    };
    const isValid = payload.adoptionStatus && payload.schools.length && payload.students > 0;

    return isValid ? payload : null;
}

function payloadForRemove(book, adoptionData) {
    return {
        id: adoptionData.map((a) => a.salesforceId),
        book,
        adoptionStatus: 'Previous Adoption',
        schools: adoptionData.map((a) => a.schoolId),
        students: adoptionData.map((a) => a.students)
    };
}

export function EditBookForm({book, afterSubmit}) {
    const {adoptions, update} = useAdoptions();
    const thisAdoption = adoptions[book.value];
    const [levelOfUseValue, setLevelOfUseValue] = React.useState(thisAdoption[0].stageName);
    const options = useOptions();
    const onSubmit = React.useCallback(
        (event) => {
            event.preventDefault();
            const formData = new window.FormData(event.target);
            const payload = payloadFromFormData(formData);

            if (!payload) {
                return;
            }
            update(thisAdoption, payload);
            afterSubmit();
        },
        [update, afterSubmit]
    );

    // stage_name should be 'Previous Adoption'
    const removeBook = React.useCallback(
        (event) => {
            event.preventDefault();
            update(thisAdoption, payloadForRemove(book.value, thisAdoption));
            afterSubmit();
        },
        [update, afterSubmit, payloadForRemove]
    );
    const changeLevelOfUse = React.useCallback(
        ({target: {value}}) => setLevelOfUseValue(value),
        [setLevelOfUseValue]
    );

    return (
        <form className="add-book" onSubmit={onSubmit}>
            <div className="instructions">
                All fields are required
            </div>
            <LabeledElement label="Book">
                {book.label}
                <input type="hidden" name="book" value={book.value} />
            </LabeledElement>
            <FormSelect
                label="Level of use"
                selectAttributes={{
                    name: 'adoptionStatus',
                    placeholder: 'Select your level of use',
                    required: true,
                    value: levelOfUseValue,
                    onChange: changeLevelOfUse
                }}
                options={options}
            />
            <InstitutionList adoption={thisAdoption} />
            <input type="submit" className="btn primary" value="Save details" />
            <a href="remove-book" className="remove-link" onClick={removeBook}>
                Remove book from my collection
            </a>
        </form>
    );
}

export default function AddBookForm({afterSubmit}) {
    const books = useBooks();
    const {adoptions, add} = useAdoptions();
    const alreadyAdoptedNames = Reflect.ownKeys(adoptions);
    const suggestions = books
        .filter((b) => !alreadyAdoptedNames.includes(b.value))
        .map((b) => b.label);
    const ref = React.useRef();
    const options = useOptions();
    const onSubmit = React.useCallback(
        (event) => {
            event.preventDefault();
            const formData = new window.FormData(event.target);
            const payload = payloadFromFormData(formData, books);

            if (!payload) {
                return;
            }
            add(payload);
            afterSubmit();
        },
        [add, afterSubmit]
    );

    React.useEffect(() => {
        const firstInput = ref.current.querySelector('[name="book"]');

        firstInput.focus();
    }, []);

    return (
        <form className="add-book" onSubmit={onSubmit} ref={ref}>
            <div className="instructions">
                All fields are required
            </div>
            <FormInput
                label="Book"
                inputProps={{
                    type: 'text', required: true, name: 'book', autocomplete: 'off'
                }}
                suggestions={suggestions}
            />
            <FormSelect
                label="Level of use"
                selectAttributes={{
                    name: 'adoptionStatus',
                    placeholder: 'Select your level of use',
                    required: true
                }}
                options={options}
            />
            <InstitutionList />
            <input type="submit" className="btn primary" value="Add" />
        </form>
    );
}
