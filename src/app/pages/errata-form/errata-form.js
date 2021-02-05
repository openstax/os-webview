import {pageWrapper} from '~/controllers/jsx-wrapper';
import React, {useState, useEffect} from 'react';
import {urlFromSlug} from '~/models/cmsFetch';
import bookPromise from '~/models/book-titles';
import userModel from '~/models/usermodel';
import linkHelper from '~/helpers/link';
import Form from './form/form';
import FormSelect from '~/components/form-select/form-select.jsx';
import $ from '~/helpers/$';
import './errata-form.css';

function getBookTitle() {
    const queryDict = $.parseSearchString(window.location.search);

    return queryDict.book ? queryDict.book[0] : null;
}

function useFormModel(title) {
    const [model, setModel] = useState();

    useEffect(() => {
        Promise.all([userModel.load(), bookPromise]).then(([userInfo, books]) => {
            const queryDict = $.parseSearchString(window.location.search);

            if (userInfo.accounts_id) {
                const entry = books.find((info) => info.title === title);
                const infoUrl = urlFromSlug(`books/${entry.meta.slug}`);

                fetch(infoUrl).then((r) => r.json()).then((bookInfo) => {
                    setModel({
                        defaultEmail: userInfo.email,
                        submittedBy: userInfo.id,
                        selectedTitle: title,
                        title: `Suggest a correction for ${title}`,
                        isTutor: Boolean(bookInfo.tutor_marketing_book),
                        mode: 'form',
                        books,
                        location: queryDict.location && queryDict.location[0],
                        source: queryDict.source && queryDict.source[0]
                    });
                });
            } else {
                window.location = linkHelper.loginLink();
            }
        });
    }, []);

    return model;
}

function ErrataForm({title}) {
    const formModel = useFormModel(title);

    if (!formModel) {
        return null;
    }

    return (
        <React.Fragment>
            <div className="hero padded">
                <h1>{formModel.title}</h1>
            </div>
            <div className="form-container text-content">
                <div>
                    <Form model={formModel} />
                </div>
            </div>
        </React.Fragment>
    );
}

function TitleSelector({setTitle}) {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        bookPromise.then((books) => {
            setOptions(books.map((book) => (
                {label: book.title, value: book.title}
            )));
        });
    }, []);

    return (
        <div className="text-content title-selector">
            <p>
                It looks like you got referred here but they didn't tell us what
                book you were looking at.
            </p>
            <FormSelect
                selectAttributes={{
                    placeholder: 'Please select one',
                    onChange(event) {
                        setTitle(event.target.value);
                    }
                }}
                label="What book were you in, again?" options={options} />
        </div>
    );
}

function TitleSelectorOrForm() {
    const [title, setTitle] = useState(getBookTitle());

    return (
        title ?
            <ErrataForm title={title} /> :
            <TitleSelector setTitle={setTitle} />
    );
}

const view = {
    classes: ['errata-form', 'page'],
    tag: 'main'
};

export default pageWrapper(TitleSelectorOrForm, view);
