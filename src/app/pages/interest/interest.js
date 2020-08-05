import React, {useState, useRef, useEffect} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {useDataFromPromise, useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form.jsx';
import {HiddenFields} from '~/components/salesforce-form/salesforce-form.jsx';
import ContactInfo from '~/components/contact-info/contact-info';
import BookSelector, {useSelectedBooks} from '~/components/book-selector/book-selector';
import FormInput from '~/components/form-input/form-input.jsx';
import FormCheckboxgroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import salesforcePromise from '~/models/salesforce';
import {afterFormSubmit} from '~/models/books';
import './interest.css';

function ContactInfoPage({selectedRole, validatorRef}) {
    return (
        <React.Fragment>
            <HiddenFields leadSource="Interest Form" />
            <input type="hidden" name="Role__c" value={selectedRole} />
            <ContactInfo validatorRef={validatorRef} />
        </React.Fragment>
    );
}

function firstSearchArgument() {
    return decodeURIComponent(window.location.search.substr(1))
        .replace(/&.*/, '');
}

function HowDidYouHear() {
    const options = [
        {value: 'Web search', label: 'Web search'},
        {value: 'Colleague', label: 'Colleague'},
        {value: 'Conference', label: 'Conference'},
        {value: 'Email', label: 'Email'},
        {value: 'Facebook', label: 'Facebook'},
        {value: 'Twitter', label: 'Twitter'},
        {value: 'Webinar', label: 'Webinar'},
        {value: 'Partner organization', label: 'Partner organization'}
    ];

    return (
        <FormCheckboxgroup name="How_did_you_Hear__c"
            longLabel="How did you hear about OpenStax?"
            instructions="Select all that apply (optional)."
            options={options}
        />
    );
}

function BookSelectorPage({selectedBooksRef, bookBeingSubmitted}) {
    const preselectedTitle = firstSearchArgument();
    const [selectedBooks, toggleBook] = useSelectedBooks();

    selectedBooksRef.current = selectedBooks;
    return (
        <div className="page-2">
            <BookSelector prompt="Which textbook(s) are you currently using?"
                required
                selectedBooks={selectedBooks}
                preselectedTitle={preselectedTitle}
                toggleBook={toggleBook}
            />
            <FormInput
                longLabel="How many students do you teach each semester?"
                inputProps={{
                    name: 'Number_of_Students__c',
                    type: 'number',
                    min: '1',
                    max: '999',
                    required: true
                }}
            />
            <HowDidYouHear />
            {
                bookBeingSubmitted &&
                    <React.Fragment>
                        <input type="hidden" name="Subject__c" value={bookBeingSubmitted.value} />
                        <input type="hidden" name="First__c" value={bookBeingSubmitted === selectedBooks[0]} />
                    </React.Fragment>
            }
        </div>
    );
}

function FacultyForm({selectedRole, onPageChange}) {
    const salesforce = useDataFromPromise(salesforcePromise, {});
    const contactValidatorRef = useRef();
    const selectedBooksRef = useRef();
    const [currentBook, setCurrentBook] = useState();
    const formRef = useRef();

    function validatePage(page) {
        return Boolean(page !== 1 || contactValidatorRef.current());
    }

    useEffect(() => {
        if (currentBook) {
            formRef.current.submit();
        }
    }, [currentBook]);

    function onSubmit(form) {
        const selectedBooks = selectedBooksRef.current;
        const submitQueue = selectedBooks.slice();
        const iframe = document.getElementById(form.target);

        // eslint-disable-next-line no-use-before-define
        const submitAfterDelay = () => setTimeout(submitNextBook, 300);

        function submitNextBook() {
            const preselectedTitle = firstSearchArgument();

            if (submitQueue.length > 0) {
                setCurrentBook(submitQueue.shift());
            } else if (iframe) {
                setCurrentBook(null);
                iframe.removeEventListener('load', submitAfterDelay);
                afterFormSubmit(preselectedTitle, selectedBooks);
            }
        }

        formRef.current = form;
        if (iframe) {
            iframe.addEventListener('load', submitAfterDelay);
        }
        submitNextBook();
    }

    return (
        <React.Fragment>
            <MultiPageForm validatePage={validatePage} action={salesforce.webtoleadUrl}
                onPageChange={onPageChange} onSubmit={onSubmit} debug={salesforce.debug}
                submitting={currentBook}
            >
                <ContactInfoPage selectedRole={selectedRole} validatorRef={contactValidatorRef} />
                <BookSelectorPage selectedBooksRef={selectedBooksRef} bookBeingSubmitted={currentBook}/>
            </MultiPageForm>
        </React.Fragment>
    );
}

export function InterestForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [hideRoleSelector, setHideRoleSelector] = useState(false);
    const ref = useRef();

    function onPageChange(page) {
        setHideRoleSelector(page > 1);
        ref.current.scrollIntoView();
    }

    useEffect(() => {
        $.setPageTitleAndDescription('Interest Form');
        // Pardot tracking
        if ('piTracker' in window) {
            piTracker(window.location.href.split('#')[0]);
        }
    }, []);
    useCanonicalLink();

    return (
        <React.Fragment>
            <FormHeader slug="pages/adoption-form" />
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className="text-content" ref={ref}>
                <RoleSelector value={selectedRole} setValue={setSelectedRole} hidden={hideRoleSelector}>
                    <StudentForm />
                    <FacultyForm selectedRole={selectedRole} onPageChange={onPageChange} />
                </RoleSelector>
            </div>
        </React.Fragment>
    );
}

const view = {
    classes: ['interest-form-v2'],
    tag: 'main'
};

export default pageWrapper(InterestForm, view);
