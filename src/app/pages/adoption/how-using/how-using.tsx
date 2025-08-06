import React from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import {adoptionOptions} from '~/contexts/salesforce';
import {SalesforceBook} from '~/helpers/books';
import {FormattedMessage, useIntl} from 'react-intl';
import './how-using.scss';

function HowManyStudents({book, dispatch}: {
    book: SalesforceBook;
    dispatch: React.Dispatch<object>;
}) {
    const updateBookValue = React.useCallback(
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
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

function HowUsingBook({book, dispatch}: {
    book: SalesforceBook;
    dispatch: React.Dispatch<object>;
}) {
    const updateBookValue = React.useCallback(
        (value: string) => dispatch({[book.value]: value}),
        [book, dispatch]
    );
    const {formatMessage} = useIntl();
    const adoptionTexts = {
        core: formatMessage({id: 'how-using.core'}),
        recommended: formatMessage({id: 'how-using.recommended'}),
        outside: formatMessage({id: 'how-using.outside'}),
        self: formatMessage({id: 'how-using.self'})
    };
    const adoptionOptionsWithLabels = adoptionOptions.map((opt) => ({...opt, label: adoptionTexts[opt.key]}));

    return (
        <FormSelect
            name={`hufs_${book.text}`}
            label={formatMessage(
                {id: 'how-using.how-using'},
                {title: book.text}
            )}
            options={adoptionOptionsWithLabels}
            selectAttributes={{
                name: `hu_${book.text}`,
                placeholder: formatMessage({id: 'selector.select-one'}),
                required: true
            }}
            onValueUpdate={updateBookValue}
        />
    );
}

function reducer(state: Record<string, unknown>, action: object) {
    return {...state, ...action};
}

export default function HowUsing({selectedBooks, year}: {
    selectedBooks: SalesforceBook[];
    year?: string;
}) {
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
