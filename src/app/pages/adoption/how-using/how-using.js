import React from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import {adoptionOptions} from '~/contexts/salesforce';
import {FormattedMessage, useIntl} from 'react-intl';
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
            <FormattedMessage
                id="how-using.how-many"
                values={{title: book.text}}
            />
            <div className="hint">
                <FormattedMessage id="how-using.hint" />
            </div>
            <input type="hidden" value={book.value} />
            <FormInput
                inputProps={{
                    type: 'number',
                    min: '1',
                    max: '999',
                    required: true,
                    onChange: updateBookValue
                }}
            />
        </div>
    );
}

function HowUsingBook({book, dispatch}) {
    const updateBookValue = React.useCallback(
        (value) => dispatch({[book.value]: value}),
        [book, dispatch]
    );
    const {formatMessage} = useIntl();
    const adoptionTexts = {
        core: formatMessage({id: 'how-using.core'}),
        recommended: formatMessage({id: 'how-using.recommended'}),
        outside: formatMessage({id: 'how-using.outside'}),
        self: formatMessage({id: 'how-using.self'})
    };

    adoptionOptions.forEach((opt) => {
        opt.text = adoptionTexts[opt.key];
    });

    return (
        <FormSelect
            label={formatMessage(
                {id: 'how-using.how-using'},
                {title: book.text}
            )}
            options={adoptionOptions}
            selectAttributes={{
                name: `hu_${book.text}`,
                placeholder: formatMessage({id: 'selector.select-one'}),
                required: true
            }}
            onValueUpdate={updateBookValue}
        />
    );
}

function reducer(state, action) {
    return {...state, ...action};
}

export default function HowUsing({selectedBooks, year}) {
    const [bookData, dispatch] = React.useReducer(reducer, {});
    const [useData, udDispatch] = React.useReducer(reducer, {});
    const json = React.useMemo(() => {
        const rewrittenBookData = selectedBooks.map(({value: name}) => {
            const match = name.match(/(.*?) *\[(.*)\]/);
            const [title, language] = match ? match.slice(1) : [name, 'English'];

            return ({
                name: title,
                students: Number(bookData[name]),
                howUsing: useData[name],
                language,
                baseYear: year
            });
        });

        return JSON.stringify({
            Books: rewrittenBookData
        });
    }, [bookData, useData, selectedBooks, year]);

    return (
        <div className="how-using">
            {selectedBooks.map((book) => (
                <React.Fragment key={book.value}>
                    <HowManyStudents book={book} dispatch={dispatch} />
                    <HowUsingBook book={book} dispatch={udDispatch} />
                </React.Fragment>
            ))}
            <input type="hidden" name="adoption_json" value={json} />
        </div>
    );
}
