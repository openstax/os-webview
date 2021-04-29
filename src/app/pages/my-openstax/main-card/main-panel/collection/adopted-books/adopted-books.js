/* eslint-disable */
import React from 'react';
import { PlusBox, PutAway } from '../../common';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Dialog from '~/components/dialog/dialog';
import { Singleselect } from '~/pages/my-openstax/multiselect/multiselect';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import {useStyledCheckbox, LabeledElement, ClickForwardingLabel} from '~/components/form-elements/form-elements';
import FormCheckboxgroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import {salesforce} from '~/models/salesforce';
import {useUserModel} from '~/models/usermodel';
import { useStoreon } from 'storeon/preact';
import './adopted-books.scss';

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

function Institution({name, value}) {
    const [StyledCheckbox, checked] = useStyledCheckbox();
    const childRef = React.useRef();
    const studentLabel = `Number of your students that would use this book at
     this institution`;

    return (
        <div className="institution-selector">
            <ClickForwardingLabel childIndex="0" childRef={childRef}>
                <StyledCheckbox name="school" value={value} forwardRef={childRef}/>
                {name}
            </ClickForwardingLabel>
            {
                checked &&
                <FormInput
                    label={studentLabel}
                    inputProps={{
                        name: 'students',
                        type: 'number', min: '1', max: '999', required: true
                    }}
                />
            }
        </div>
    )
}

function InstitutionList() {
    return (
        <LabeledElement label="Institution(s) where this book would be used">
            <div className="checkbox-group">
                <Institution name="Bebop University" value="Bebop" />
                <Institution name="XYZ University" value="XYZ" />
            </div>
        </LabeledElement>
    );
}

const options = salesforce.adoption(['adopted', 'recommended'])
    .map((a) => ({
        label: a.text,
        value: a.value
    }));

function payloadFromFormData(formData) {
    return {
        accountsId: formData.get('accountsId'),
        book: formData.get('book'),
        adoptionStatus: formData.get('adoptionStatus'),
        schools: formData.getAll('school'),
        students: formData.getAll('students')
    };
}

function AddBookForm({afterSubmit}) {
    const { books } = useStoreon('books');
    const { adoptions, dispatch } = useStoreon('adoptions');
    const suggestions = books.filter((b) => !adoptions.includes(b.value))
        .map((b) => b.label);
    const {accounts_id: accountsId} = useUserModel() || {};

    function onSubmit(event) {
        event.preventDefault();
        const formData = new window.FormData(event.target);

        dispatch('adoptions/update', payloadFromFormData(formData));
        afterSubmit();
    }

    return (
        <form className="add-book" onSubmit={onSubmit}>
            <input type="hidden" name="accountsId" value={accountsId} />
            <div className="instructions">
                All fields are required
            </div>
            <FormInput
                label="Book"
                inputProps={{type: 'text', required: true, name: 'book', autocomplete: 'off'}}
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

function BookAdder() {
    const [isOpen, toggle] = useToggle();

    return (
        <div
            className="card-with-subtitle"
            role="button" onClick={() => toggle()}
            tabIndex="0"
        >
            <div className='add-book card'>
                <PlusBox />
            </div>
            <div>Add a book</div>
            <Dialog isOpen={isOpen} title="Add new book" closeOnOutsideClick>
                <AddBookForm afterSubmit={toggle} />
            </Dialog>
        </div>
    )
}

// function AddBook() {
//     const { dispatch, books } = useStoreon('books');
//     const [showSelector, updateShowSelector] = useState(false);
//     const bookToOption = (b) => ({
//         label: b.title,
//         value: b
//     });
//     const selectedOptions = books.filter((book) => book.selected).map(bookToOption);
//     const unselectedOptions = books.filter((book) => !book.selected).map(bookToOption);
//     const getLabel = (b) => b.title;
//
//     function toggleSelector() {
//         updateShowSelector(!showSelector);
//     }
//     function onSelect(item) {
//         dispatch('books/add', item);
//     }
//     function onRemove(item) {
//         dispatch('books/remove', item);
//     }
//
//     /*
//         <Singleselect
//             initialValue={selectedOption} options={bookOptions}
//             disabled={disabled} autoFocus={!disabled}
//             onChange={onChangeTitle}
//         />
//     */
//     return (
//         <React.Fragment>
//             <div className='add-book' role='button' onClick={toggleSelector}>
//                 <PlusBox />
//                 <span>Add a book</span>
//             </div>
//             {
//                 showSelector &&
//                 <Singleselect
//                     putAway={toggleSelector} title='Add new book'
//                     prompt='Book' options={unselectedOptions}
//                     selectedOptions={selectedOptions}
//                     getLabel={getLabel}
//                     onSelect={onSelect}
//                     onRemove={onRemove}
//                 />
//             }
//         </React.Fragment>
//     );
// }

export default function AdoptedBooks() {
    const { books } = useStoreon('books');

    return (
        <div className="adopted-books">
            {
                books.filter((book) => book.selected).map((book) =>
                    <Book name={book.title} key={book.title} />
                )
            }
            <BookAdder />
        </div>
    );
}
