import {pageWrapper} from '~/controllers/jsx-wrapper';
import React, {useState, useEffect} from 'react';
import {urlFromSlug} from '~/models/cmsFetch';
import bookPromise from '~/models/book-titles';
import userModel from '~/models/usermodel';
import linkHelper from '~/helpers/link';
import Form from './form/form';
import $ from '~/helpers/$';
import './errata-form.css';

function useFormModel() {
    const [model, setModel] = useState();

    useEffect(() => {
        const queryDict = $.parseSearchString(window.location.search);
        const title = queryDict.book[0];

        Promise.all([userModel.load(), bookPromise]).then(([userInfo, books]) => {
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

function ErrataForm() {
    const formModel = useFormModel();

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

const view = {
    classes: ['errata-form', 'page'],
    tag: 'main'
};

export default pageWrapper(ErrataForm, view);
