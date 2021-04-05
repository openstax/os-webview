import React, {useState, useRef} from 'react';
import ErrorTypeSelector from './ErrorTypeSelector';
import ErrorSourceSelector from './ErrorSourceSelector';
import ErrorLocationSelector from './ErrorLocationSelector/ErrorLocationSelector';
import FileUploader from './FileUploader';
import managedInvalidMessage from './InvalidMessage.js';
import $ from '~/helpers/$';
import Dialog from '~/components/dialog/dialog';
import routerBus from '~/helpers/router-bus';
import cn from 'classnames';
import './form.scss';

const sourceNames = {
    tutor: 'OpenStax Tutor'
};
const postEndpoint = `${$.apiOriginAndOldPrefix}/errata/`;

function ErrorExplanationBox() {
    const inputRef = useRef();
    const [InvalidMessage, updateInvalidMessage] = managedInvalidMessage(inputRef);

    return (
        <React.Fragment>
            <div className="question">Tell us in detail about the error and your suggestion.</div>
            <div className="subnote wide">
                Please limit to one error per submission and include a suggested
                resolution if possible. If you have several to report, please
                contact us at <a href="mailto:errata@openstax.org">errata@openstax.org</a>.
            </div>
            <InvalidMessage />
            <textarea
                maxLength="4000" name="detail" skip="true"
                ref={inputRef} onChange={updateInvalidMessage}
                required></textarea>
        </React.Fragment>
    );
}

function SubmitButton({hasError, setHideErrors, submitting, setSubmitting}) {
    function validateBeforeSubmitting(event) {
        event.preventDefault();
        setHideErrors(false);
        if (!hasError) {
            setSubmitting(true);
        }
    }

    return (
        <div className="submit-button">
            <input
                type="submit" className="btn" value="Submit"
                disabled={submitting} onClick={validateBeforeSubmitting}
            />
            {hasError && <div className="invalid-message">{hasError}</div>}
        </div>
    );
}

function FormFields({
    submittedBy, books, initialSource, location, source, selectedTitle,
    hasError, setHideErrors, submitting, setSubmitting
}) {
    const selectedBook = (books.find((b) => b.title === selectedTitle) || {});

    return (
        <React.Fragment>
            <input type="hidden" name="submitted_by_account_id" value={submittedBy} />
            <input type="hidden" name="book" value={selectedBook.id} />
            <ErrorTypeSelector />
            <ErrorSourceSelector
                initialSource={initialSource}
            />
            <ErrorLocationSelector
                selectedBook={selectedBook}
                defaultValue={location}
                readOnly={location && source}
                title={selectedTitle}
            />
            <ErrorExplanationBox />
            <div className="question">Please add a screenshot or any other file that helps explain the error.</div>
            <div className="button-group">
                <FileUploader />
                <SubmitButton {...{hasError, setHideErrors, submitting, setSubmitting}} />
            </div>
        </React.Fragment>
    );
}

// Safari cannot handle empty files; Edge cannot manipulate FormData
// so we remove the file inputs that have no values
function removeEmptyFileWidgets(formEl) {
    const fileInputs = Array.from(formEl.querySelectorAll('[type="file"]'));
    const fiParents = fileInputs.map((el) => el.parentNode);

    fileInputs.forEach((el) => {
        if (el.value === '') {
            el.parentNode.removeChild(el);
        }
    });
    fileInputs.forEach((el, index) => {
        el.setAttribute('name', `file_${index+1}`);
    });

    // Return a function to put them back
    return () => {
        fileInputs.forEach((el, i) => {
            fiParents[i].appendChild(el);
        });
    };
}

function BannedNotice({text}) {
    return (
        <div className="banned-notice">{text}</div>
    );
}

export default function ErrataForm({
    model: {books, selectedTitle, source, submittedBy, location}
}) {
    const [hasError, setHasError] = useState('You have not completed the form');
    const [hideErrors, setHideErrors] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef();
    const initialSource = source && sourceNames[source.toLowerCase()];
    const [bannedText, setBannedText] = useState();

    function validate() {
        const invalid = formRef.current.querySelector(':invalid');

        setHasError(invalid ? 'You have not completed the form.' : null);
    }

    // TESTING
    // React.useEffect(() => {
    //     setTimeout(() => {
    //         console.info('Setting banned notice text');
    //         setBannedText('This is your banned notice. Just testing.');
    //     }, 2200);
    // }, []);

    React.useEffect(() => {
        if (submitting) {
            const formEl = formRef.current;
            const putFileWidgetsBack = removeEmptyFileWidgets(formEl);
            const formData = new FormData(formEl);

            // Programmatically post the form
            fetch(postEndpoint, {
                method: 'POST',
                body: formData
            }).then((r) => r.json())
                .then(
                    (json) => {
                        if (json.id) {
                            routerBus.emit('navigate', `/confirmation/errata?id=${json.id}`);
                        } else if (json.submitted_by_account_id) {
                            setBannedText(json.submitted_by_account_id[0]);
                        }
                    },
                    (fetchError) => {
                        setHasError(`Submit failed: ${fetchError}.`);
                        putFileWidgetsBack();
                    }
                );
        }
    }, [submitting]);

    return (
        <React.Fragment>
            <form
                className={cn('body-block', {'hide-errors': hideErrors})}
                method="post" action={postEndpoint}
                encType="multipart/form-data"
                onChange={validate}
                ref={formRef}
            >
                <FormFields
                    {...{submittedBy, books, initialSource, location, source, selectedTitle,
                        hasError, setHideErrors, submitting, setSubmitting
                    }}
                />
            </form>
            <Dialog
                isOpen={bannedText} onPutAway={() => setBannedText(null)}
                title="Errata submission rejected"
            >
                <BannedNotice text={bannedText} />
            </Dialog>
        </React.Fragment>
    );
}
