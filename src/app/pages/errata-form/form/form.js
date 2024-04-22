import React, {useState, useRef} from 'react';
import useErrataFormContext from '../errata-form-context';
import useUserContext from '~/contexts/user';
import ErrorTypeSelector from './ErrorTypeSelector';
import ErrorSourceSelector from './ErrorSourceSelector';
import ErrorLocationSelector from './ErrorLocationSelector/ErrorLocationSelector';
import FileUploader from './FileUploader';
import managedInvalidMessage from './InvalidMessage.js';
import $ from '~/helpers/$';
import Dialog from '~/components/dialog/dialog';
import {useNavigate} from 'react-router-dom';
import cn from 'classnames';
import './form.scss';

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
                maxLength="4000" name="detail"
                ref={inputRef} onChange={updateInvalidMessage}
                required></textarea>
        </React.Fragment>
    );
}

function SubmitButton() {
    const {hasError, submitting, validateBeforeSubmitting} = useErrataFormContext();

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

const semesters = [
    ['March', 'October', 'spring'],
    ['November', 'February', 'fall']
];

function RevisionSchedule() {
    const currentMonth = new Date().getMonth();
    const index = currentMonth >= 2 && currentMonth <= 9 ? 0 : 1;
    const [start, end, semester] = semesters[index];

    return (
        <div className="revision-schedule">
            Errata received from <b>{start}</b> through <b>{end}</b> will be fixed
            in the online format for the <b>{semester}</b> semester.
            <br />
            PDF versions of OpenStax textbooks are only updated once a year, prior
            to the fall semester, if there are substantial errata updates to the
            book that year.
        </div>
    );
}

function FormFields() {
    const {selectedBook} = useErrataFormContext();
    const {accountId: submittedBy} = useUserContext();

    return (
        <React.Fragment>
            <input type="hidden" name="submitted_by_account_id" value={submittedBy} />
            <input type="hidden" name="book" value={selectedBook.id} />
            <ErrorTypeSelector />
            <ErrorSourceSelector />
            <ErrorLocationSelector />
            <ErrorExplanationBox />
            <div className="question">Please add a screenshot or any other file that helps explain the error.</div>
            <div className="button-group">
                <FileUploader />
                <SubmitButton />
            </div>
            <RevisionSchedule />
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

function useBannedDialog() {
    const [bannedText, setBannedText] = useState();
    const navigate = useNavigate();
    const handleSubmissionResponse = React.useCallback(
        (json) => {
            if (json.id) {
                navigate(`/confirmation/errata?id=${json.id}`);
            } else if (json.submitted_by_account_id) {
                setBannedText(json.submitted_by_account_id[0]);
            }
        },
        [navigate]
    );

    // TESTING
    // React.useEffect(() => {
    //     window.setTimeout(() => {
    //         console.info('Setting banned notice text');
    //         setBannedText('This is your banned notice. Just testing.');
    //     }, 2200);
    // }, []);

    function BannedDialog() {
        return (
            <Dialog
                isOpen={bannedText} onPutAway={() => setBannedText(null)}
                title="Errata submission rejected"
            >
                <div className="banned-notice">{bannedText}</div>
            </Dialog>
        );
    }

    return [BannedDialog, handleSubmissionResponse];
}

export default function ErrataForm() {
    const {hideErrors, submitting, setHasError} = useErrataFormContext();
    const [BannedDialog, handleSubmissionResponse] = useBannedDialog();
    const formRef = useRef();

    function validate() {
        const invalid = formRef.current.querySelector(':invalid');

        setHasError(invalid ? 'You have not completed the form.' : null);
    }

    React.useEffect(() => {
        if (submitting) {
            const formEl = formRef.current;
            const putFileWidgetsBack = removeEmptyFileWidgets(formEl);
            const formData = new window.FormData(formEl);

            // Programmatically post the form
            fetch(
                postEndpoint,
                {
                    method: 'POST',
                    body: formData
                }
            )
                .then((r) => r.json())
                .catch((err) => {throw new Error(`Posting errata form data: ${err}`);})
                .then(
                    handleSubmissionResponse,
                    (fetchError) => {
                        setHasError(`Submit failed: ${fetchError}.`);
                        putFileWidgetsBack();
                    }
                )
            ;
        }
    }, [submitting, setHasError, handleSubmissionResponse]);

    return (
        <React.Fragment>
            <form
                className={cn('body-block', {'hide-errors': hideErrors})}
                method="post" action={postEndpoint}
                encType="multipart/form-data"
                onChange={validate}
                ref={formRef}
            >
                <FormFields />
            </form>
            <BannedDialog />
        </React.Fragment>
    );
}
