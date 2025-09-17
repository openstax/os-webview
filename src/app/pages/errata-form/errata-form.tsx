import React from 'react';
import Form from './form/form';
import FormSelect from '~/components/form-select/form-select';
import useErrataFormContext, {ErrataFormContextProvider} from './errata-form-context';
import useUserContext from '~/contexts/user';
import linkHelper from '~/helpers/link';
import './errata-form.scss';

type Book = {
    title: string;
};

function ErrataForm() {
    const {title} = useErrataFormContext();

    return (
        <React.Fragment>
            <div className="hero padded">
                <h1>{`Suggest a correction for ${title}`}</h1>
            </div>
            <div className="form-container text-content">
                <div>
                    <Form />
                </div>
            </div>
        </React.Fragment>
    );
}

function TitleSelector() {
    const {books, setTitle} = useErrataFormContext();
    const options = React.useMemo(
        () => books?.map((book: Book) => ({label: book.title, value: book.title})),
        [books]
    );

    return (
        <div className="text-content title-selector">
            <p>
                It looks like you got referred here but they didn&apos;t tell us what
                book you were looking at.
            </p>
            <FormSelect
                name="title-selector"
                selectAttributes={{
                    placeholder: 'Please select one'
                }}
                onValueUpdate={setTitle}
                label="What book were you in, again?" options={options ?? []} />
        </div>
    );
}

function TitleSelectorOrForm() {
    const {title} = useErrataFormContext();

    return (
        <main className="errata-form page">
            {title ? <ErrataForm /> : <TitleSelector />}
        </main>
    );
}

export default function EnsureLoggedIn() {
    const {uuid} = useUserContext();

    if (!uuid) {
        return (
            <main className="errata-form page">
                <div className="boxed">
                    <div>You need to be logged in to submit errata</div>
                    <a className="btn primary" href={linkHelper.loginLink()} data-local="true">Log in</a>
                </div>
            </main>
        );
    }
    return (
        <ErrataFormContextProvider>
            <TitleSelectorOrForm />
        </ErrataFormContextProvider>
    );
}
