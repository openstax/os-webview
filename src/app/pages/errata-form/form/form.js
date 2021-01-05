import React, {useState, useRef} from 'react';
import ErrorTypeSelector from './ErrorTypeSelector';
import ErrorSourceSelector from './ErrorSourceSelector';
import ErrorLocationSelector from './ErrorLocationSelector/ErrorLocationSelector';
import FileUploader from './FileUploader';
import managedInvalidMessage from './InvalidMessage.js';
import $ from '~/helpers/$';
import shellBus from '~/components/shell/shell-bus';
import routerBus from '~/helpers/router-bus';
import BannedNotice from '../banned-notice/banned-notice';
import css from './form.css';

const sourceNames = {
    tutor: 'OpenStax Tutor'
};

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

function SubmitButton({
    formRef,
    updateHasBeenSubmitted,
    submitted,
    submitFailed
}) {
    function doCustomValidation(event) {
        const invalid = formRef.current.querySelector('form :invalid');

        if (invalid) {
            event.preventDefault();
            updateHasBeenSubmitted(true);
        }
    }

    return (
        <div>
            <input type="submit" className="btn" value="Submit" disabled={submitted} onClick={doCustomValidation} />
            {
                submitFailed &&
                <div className="invalid-message">{submitFailed}</div>
            }
        </div>
    );
}


export default function ErrataForm({model}) {
    const selectedBook = (model.books.find((b) => b.title === model.selectedTitle) || {});
    const [selectedError, updateSelectedError] = useState();
    const [submitted, updateSubmitted] = useState(false);
    const [hasBeenSubmitted, updateHasBeenSubmitted] = useState(false);
    const [submitFailed, updateSubmitFailed] = useState();
    const postEndpoint = `${$.apiOriginAndOldPrefix}/errata/`;
    const formRef = useRef();
    const helpBoxVisible = () => selectedError === 'Other' ? 'visible' : 'not-visible';
    const initialSource = model.source && sourceNames[model.source.toLowerCase()];

    function onSubmit(event) {
        // Safari cannot handle empty files; Edge cannot manipulate FormData
        // so we remove the file inputs that have no values
        const formEl = event.target;
        const fileInputs = Array.from(formEl.querySelectorAll('[type="file"]'));
        const fiParents = fileInputs.map((el) => el.parentNode);

        fileInputs.forEach((el, index) => {
            if (el.value === '') {
                el.parentNode.removeChild(el);
            }
        });
        fileInputs.forEach((el, index) => {
            el.setAttribute('name', `file_${index+1}`);
        });

        const form = new FormData(formRef.current);

        event.preventDefault();
        // Programmatically post the form
        fetch(postEndpoint, {
            method: 'POST',
            body: form
        }).then((r) => r.json()).then(
            (json) => {
                if (json.id) {
                    updateSubmitted(false);
                    routerBus.emit('navigate', `/confirmation/errata?id=${json.id}`);
                } else if (json.submitted_by_account_id) {
                    shellBus.emit('showDialog', () => ({
                        title: 'Errata submission rejected',
                        content: new BannedNotice({
                            model: {
                                text: json.submitted_by_account_id[0]
                            }
                        })
                    }));
                }
            },
            (fetchError) => {
                updateSubmitFailed(`Submit failed: ${fetchError}.`);
                updateSubmitted(false);
                // Put them back
                fileInputs.forEach((el, i) => {
                    fiParents[i].appendChild(el);
                });
            }
        );
    }

    return (
        <form
            className={`body-block ${hasBeenSubmitted ? '' : 'hide-errors'}`}
            method="post" action={postEndpoint}
            encType="multipart/form-data" ref={formRef}
            onSubmit={onSubmit}
        >
            <input type="hidden" name="submitted_by_account_id" value={model.submittedBy} />
            <input type="hidden" name="book" value={selectedBook.id} />
            <ErrorTypeSelector
                selectedError={selectedError}
                updateSelectedError={updateSelectedError}
            />
            <div className={`helpbox ${helpBoxVisible()}`}>
                <span>Need help logging in or have general questions? Contact Support at </span>
                <a href="mailto:support@openstax.org">support@openstax.org</a>.
            </div>
            <ErrorSourceSelector
                initialSource={initialSource}
            />
            <ErrorLocationSelector
                selectedBook={selectedBook}
                defaultValue={model.location}
                readOnly={model.location && model.source}
                title={model.selectedTitle}
            />
            <ErrorExplanationBox />
            <div className="question">Please add a screenshot or any other file that helps explain the error.</div>
            <FileUploader
                Slot={() =>
                    <SubmitButton
                        formRef={formRef}
                        updateHasBeenSubmitted={updateHasBeenSubmitted}
                        submitted={submitted}
                    />}
            />
        </form>
    );
}
