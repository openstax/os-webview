import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './errata-form.html';
import bookPromise from '~/models/book-titles';
import userModel from '~/models/usermodel';
import $ from '~/helpers/$';
import Form from './form/form';
import css from './errata-form.css';
import settings from 'settings';
import linkHelper from '~/helpers/link';

const spec = {
    template,
    css,
    view: {
        classes: ['errata-form', 'page'],
        tag: 'main'
    },
    model: {},
    regions: {
        form: '.form-container'
    }
};

export default class extends componentType(spec) {

    init() {
        super.init();
        this.queryDict = $.parseSearchString(window.location.search);

        this.model.title = this.queryDict.book[0];
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }

        Promise.all([userModel.load(), bookPromise]).then(([userInfo, books]) => {
            const title = this.model.title;
            const formModel = {
                defaultEmail: userInfo.email,
                submittedBy: userInfo.id,
                selectedTitle: title
            };

            if (userInfo.accounts_id) {
                formModel.title = () => `Suggest a Correction for ${formModel.selectedTitle}`;
                const entry = books.find((info) => info.title === title);
                const slug = entry.meta.slug;
                const infoUrl = `${settings.apiOrigin}${settings.apiPrefix}/books/${slug}`;

                fetch(infoUrl).then((r) => r.json()).then((bookInfo) => {
                    formModel.isTutor = Boolean(bookInfo.tutor_marketing_book);
                    Object.assign(formModel, {
                        mode: 'form',
                        selectedTitle: title,
                        books,
                        location: this.queryDict.location && this.queryDict.location[0],
                        source: this.queryDict.source && this.queryDict.source[0]
                    });
                    const form = new Form(formModel);

                    this.regions.form.attach(form);
                    this.update();
                });
            } else {
                window.location = linkHelper.loginLink();
            }
        });
    }

}
