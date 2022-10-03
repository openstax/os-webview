import React from 'react';
import FormInput from '~/components/form-input/form-input';
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


function reducer(state, action) {
    return {...state, ...action};
}

export default function HowUsing({selectedBooks}) {
    const [bookData, dispatch] = React.useReducer(reducer, {});
    const json = React.useMemo(
        () => {
            const rewrittenBookData = selectedBooks.map(
                ({value: name}) => ({name, students: Number(bookData[name])})
            );

            return JSON.stringify({
                'Books': rewrittenBookData
            });
        },
        [bookData, selectedBooks]
    );

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
