import React from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import {adoptionOptions} from '~/contexts/salesforce';
import './how-using.scss';

function HowManyStudents({book, dispatch}) {
    const updateBookValue = React.useCallback(
        ({target: {value}}) => {
            dispatch({[book.value]: value});
        },
        [book, dispatch]
    );

    return (
        <div>
            How many students are using {book.text} each semester?
            <div className="hint">Include sections taught by TAs that you oversee</div>
            <input type="hidden" value={book.value} />
            <FormInput
                inputProps={{
                    type: 'number',
                    min: '1',
                    max: '999',
                    required: true,
                    onChange: updateBookValue
                }} />
        </div>
    );
}

function HowUsingBook({book, dispatch}) {
    const updateBookValue = React.useCallback(
        (value) => dispatch({[book.value]: value}),
        [book, dispatch]
    );

    return (
        <FormSelect
            label={`How are you using ${book.text}?`}
            options={adoptionOptions}
            selectAttributes={{
                name: `hu_${book.text}`,
                placeholder: 'Please select one',
                required: true
            }}
            onValueUpdate={updateBookValue}
        />
    );
}


function reducer(state, action) {
    return {...state, ...action};
}

export default function HowUsing({selectedBooks}) {
    const [bookData, dispatch] = React.useReducer(reducer, {});
    const [useData, udDispatch] = React.useReducer(reducer, {});
    const json = React.useMemo(
        () => {
            const rewrittenBookData = selectedBooks.map(
                ({value: name}) => ({name, students: Number(bookData[name]), howUsing: useData[name]})
            );

            return JSON.stringify({
                'Books': rewrittenBookData
            });
        },
        [bookData, useData, selectedBooks]
    );

    return (
        <div className="how-using">
            {
                selectedBooks.map((book) =>
                    <React.Fragment key={book.value}>
                        <HowManyStudents book={book} dispatch={dispatch} />
                        <HowUsingBook book={book} dispatch={udDispatch} />
                    </React.Fragment>
                )
            }
            <input type="hidden" name="adoption_json" value={json} />
        </div>
    );
}
