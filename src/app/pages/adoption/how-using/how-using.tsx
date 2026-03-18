import React from 'react';
import FormInput from '~/components/form-input/form-input';
import FormSelect from '~/components/form-select/form-select';
import {adoptionOptions} from '~/contexts/salesforce';
import {SalesforceBook} from '~/helpers/books';
import {FormattedMessage, useIntl} from 'react-intl';
import './how-using.scss';

function BookCard({
    book,
    dispatch,
    udDispatch
}: {
    book: SalesforceBook;
    dispatch: React.Dispatch<object>;
    udDispatch: React.Dispatch<object>;
}) {
    const {formatMessage} = useIntl();
    const updateStudentCount = React.useCallback(
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({[book.value]: value});
        },
        [book, dispatch]
    );
    const updateHowUsing = React.useCallback(
        (value: string) => udDispatch({[book.value]: value}),
        [book, udDispatch]
    );
    const coreText = formatMessage({id: 'how-using.core'});
    const recommendedText = formatMessage({id: 'how-using.recommended'});
    const outsideText = formatMessage({id: 'how-using.outside'});
    const selfText = formatMessage({id: 'how-using.self'});
    const adoptionOptionsWithLabels = React.useMemo(() => {
        const texts = {
            core: coreText,
            recommended: recommendedText,
            outside: outsideText,
            self: selfText
        };

        return adoptionOptions.map((opt) => ({
            ...opt,
            label: texts[opt.key],
            selected: opt.key === 'core'
        }));
    }, [coreText, recommendedText, outsideText, selfText]);

    return (
        <div className="book-card">
            <div className="book-card-header">
                {book.coverUrl && (
                    <img
                        src={book.coverUrl}
                        alt=""
                        className="book-cover"
                    />
                )}
                <span className="book-title">{book.text}</span>
            </div>
            <div className="book-card-fields">
                <div className="field-group">
                    <div className="hint">
                        <FormattedMessage id="how-using.hint" />
                    </div>
                    <input type="hidden" value={book.value} />
                    <FormInput
                        label={formatMessage({id: 'how-using.students-label', defaultMessage: 'Students per semester'})}
                        inputProps={{
                            type: 'number',
                            min: '1',
                            max: '999',
                            required: true,
                            onChange: updateStudentCount
                        }}
                    />
                </div>
                <div className="field-group">
                    <FormSelect
                        name={`hufs_${book.text}`}
                        label={formatMessage({
                            id: 'how-using.usage-label',
                            defaultMessage: 'How are you using this book?'
                        })}
                        options={adoptionOptionsWithLabels}
                        selectAttributes={{
                            name: `hu_${book.text}`,
                            placeholder: coreText,
                            required: true
                        }}
                        onValueUpdate={updateHowUsing}
                    />
                </div>
            </div>
        </div>
    );
}

function reducer(state: Record<string, unknown>, action: object) {
    return {...state, ...action};
}

export default function HowUsing({selectedBooks, years}: {
    selectedBooks: SalesforceBook[];
    years: string[];
}) {
    const coreValue = adoptionOptions[0].value;
    const [bookData, dispatch] = React.useReducer(reducer, {});
    const [useData, udDispatch] = React.useReducer(reducer, {});
    const json = React.useMemo(() => {
        const rewrittenBookData = years.flatMap((year) =>
            selectedBooks.map(({value: name}) => {
                const match = name.match(/(.*?) *\[(.*)\]/);
                const [title, language] = match ? match.slice(1) : [name, 'English'];

                return ({
                    name: title,
                    students: Number(bookData[name]),
                    howUsing: useData[name] || coreValue,
                    language,
                    baseYear: year
                });
            })
        );

        return JSON.stringify({
            Books: rewrittenBookData
        });
    }, [bookData, useData, selectedBooks, years, coreValue]);

    return (
        <div className="how-using">
            {selectedBooks.map((book) => (
                <BookCard
                    key={book.value}
                    book={book}
                    dispatch={dispatch}
                    udDispatch={udDispatch}
                />
            ))}
            <input type="hidden" name="adoption_json" value={json} />
        </div>
    );
}
