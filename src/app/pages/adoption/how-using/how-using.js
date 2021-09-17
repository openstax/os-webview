import React from 'react';
import FormInput from '~/components/form-input/form-input';
import './how-using.scss';

function HowManyStudents({book, dispatch}) {
    function onChange({target: {value}}) {
        dispatch({[book.value]: value});
    }

    return (
        <div>
            How many students are using {book.text} each semester?
            <div className="hint">Include sections taught by TAs that you oversee</div>
            <input type="hidden" name="book" value={book.value} />
            <FormInput
                inputProps={{
                    type: 'number',
                    min: '1',
                    max: '999',
                    required: true,
                    onChange
                }} />
        </div>
    );
}


function reducer(state, action) {
    return {...state, ...action};
}

export default function HowUsing({selectedBooks}) {
    const [bookData, dispatch] = React.useReducer(reducer, {});
    const rewrittenBookData = selectedBooks.map(
        ({value: name}) => ({name, students: +bookData[name]})
    );
    const json = JSON.stringify({
        'Books': rewrittenBookData,
        newAdoption: true
    });

    return (
        <div className="how-using">
            {
                selectedBooks.map((book) =>
                    <HowManyStudents book={book} key={book.value} dispatch={dispatch} />
                )
            }
            <input type="hidden" name="adoption_json" value={json} />
        </div>
    );
}
