import React, {useState, useRef, useCallback} from 'react';
import {useLocation} from 'react-router-dom';
import useDocumentHead, {useCanonicalLink} from '~/helpers/use-document-head';
import FormHeader from '~/components/form-header/form-header';
import RoleSelector from '~/components/role-selector/role-selector';
import StudentForm from '~/components/student-form/student-form';
import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import ContactInfo from '~/components/contact-info/contact-info';
import {useAfterSubmit} from '~/components/book-selector/after-form-submit';
import BookSelector, {
    useSelectedBooks
} from '~/components/book-selector/book-selector';
import {SalesforceBook} from '~/helpers/books';
import HowUsing from './how-using/how-using';
import useSalesforceContext from '~/contexts/salesforce';
import useFormTarget from '~/components/form-target/form-target';
import TrackingParameters from '~/components/tracking-parameters/tracking-parameters';
import useUserContext from '~/contexts/user';
import type {UserModelType} from '~/models/usermodel';
import {useIntl} from 'react-intl';
import './adoption.scss';

function BookSelectorPage({
    selectedBooksRef,
    years
}: {
    selectedBooksRef: React.MutableRefObject<SalesforceBook[]>;
    years: string[];
}) {
    const [selectedBooks, toggleBook] = useSelectedBooks();
    const bookList = React.useMemo(
        () =>
            selectedBooks.map((b) => b.value.replace(/ *\[.*/, '')).join('; '),
        [selectedBooks]
    );
    const {formatMessage} = useIntl();
    const instructions = formatMessage({id: 'adoption.instructions'});
    const includeFilter = React.useCallback(
        (b: SalesforceBook) => !b.comingSoon,
        []
    );

    selectedBooksRef.current = selectedBooks;
    return (
        <React.Fragment>
            <BookSelector
                prompt={formatMessage({id: 'adoption.book-prompt'})}
                selectedBooks={selectedBooks}
                toggleBook={toggleBook}
                limit={5}
                additionalInstructions={instructions}
                includeFilter={includeFilter}
            />
            <input type="hidden" name="subject_interest" value={bookList} />
            <label>
                <div className="control-group">
                    <HowUsing selectedBooks={selectedBooks} years={years} />
                </div>
            </label>
        </React.Fragment>
    );
}

const roleToPosition: Record<string, string> = {
    instructor: 'Faculty',
    administrator: 'Administrator',
    librarian: 'Librarian',
    designer: 'Instructional Designer',
    adjunct: 'Adjunct Faculty',
    homeschool: 'Home School Teacher'
};

function positionFromRole(role?: string) {
    return roleToPosition[role ?? ''] ?? 'Other';
}

function HiddenField({name, value}: {name: string; value?: string}) {
    return <input type="hidden" name={name} value={value ?? ''} />;
}

function hiddenContactFields(userModel: UserModelType) {
    const a = userModel.accountsModel;

    return [
        ['first_name', userModel.first_name],
        ['last_name', userModel.last_name],
        ['email', userModel.email],
        ['school', a?.school_name],
        ['school_type', a?.school_type],
        ['school_location', a?.school_location],
        ['salesforce_contact_id', userModel.salesforce_contact_id]
    ] as [string, string | undefined][];
}

function HiddenContactInfo() {
    const {userModel} = useUserContext();
    const fields = userModel ? hiddenContactFields(userModel) : [];

    return (
        <React.Fragment>
            {fields.map(([name, value]) => (
                <HiddenField key={name} name={name} value={value} />
            ))}
        </React.Fragment>
    );
}

const now = new Date();
const defaultStartYear = now.getFullYear() - (now.getMonth() < 6 ? 2 : 1);
const academicYears = [0, 1, 2].map((n) => defaultStartYear + n);

function YearCheckboxes({
    selectedYears,
    toggleYear
}: {
    selectedYears: string[];
    toggleYear: (year: string) => void;
}) {
    return (
        <div className="year-checkboxes">
            <span className="year-label">
                Which school year(s) are you reporting for?
            </span>
            <div className="year-options">
                {academicYears.map((startYear) => {
                    const value = startYear.toString();
                    const label = `${startYear}\u2013${startYear + 1}`;

                    return (
                        <label key={value} className="year-option">
                            <input
                                type="checkbox"
                                checked={selectedYears.includes(value)}
                                onChange={() => toggleYear(value)}
                            />
                            {label}
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

function useSelectedYears(initialYear?: string) {
    const defaultYear = (initialYear ?? (defaultStartYear + 1)).toString();
    const [years, setYears] = useState<string[]>([defaultYear]);
    const toggleYear = useCallback(
        (year: string) =>
            setYears((prev) =>
                prev.includes(year)
                    ? prev.filter((y) => y !== year)
                    : [...prev, year]
            ),
        []
    );

    return [years, toggleYear] as const;
}


function PersonalizedHeader() {
    const {userModel} = useUserContext();

    if (!userModel) {
        return null;
    }

    return (
        <div className="form-header personalized-header">
            <div className="text-content subhead">
                <h1>Hi {userModel.first_name}, thanks for using OpenStax!</h1>
                <p>
                    This form helps us track our mission impact by
                    recording faculty usage and the number of students
                    reached. Our future grant funding depends on it.
                </p>
                <p className="note">
                    This form is for instructors and faculty only and does
                    not provide access to instructor resources.
                </p>
            </div>
        </div>
    );
}

function FacultyForm({
    position,
    onPageChange
}: {
    position: string;
    onPageChange: (page: number) => void;
}) {
    const selectedBooksRef = useRef<SalesforceBook[]>([]);
    const afterSubmit = useAfterSubmit(selectedBooksRef);
    const {onSubmit, submitting, FormTarget} = useFormTarget(afterSubmit);
    const {adoptionUrl} = useSalesforceContext();
    const {userModel} = useUserContext();
    const isLoggedIn = Boolean(userModel?.last_name);

    const {search} = useLocation();
    const initialYear =
        new window.URLSearchParams(search).get('year') ?? undefined;
    const [selectedYears, toggleYear] = useSelectedYears(initialYear);

    const validatePage = useCallback((page: number) => {
        const booksPage = isLoggedIn ? 1 : 2;

        if (page === booksPage && selectedBooksRef.current.length < 1) {
            return false;
        }
        return selectedYears.length > 0;
    }, [isLoggedIn, selectedYears]);

    const doSubmit = useCallback(
        (form: HTMLFormElement) => {
            form.submit();
            onSubmit();
        },
        [onSubmit]
    );

    const hiddenFields = (
        <React.Fragment>
            <TrackingParameters />
            <input type="hidden" name="position" value={position} />
            <input type="hidden" name="role" value="Instructor" />
            <input
                type="hidden"
                name="lead_source"
                value="Adoption Form"
            />
            <input
                type="hidden"
                name="process_adoptions"
                value="true"
            />
        </React.Fragment>
    );

    const yearCheckboxes = (
        <div className="year-selector-container">
            <YearCheckboxes
                selectedYears={selectedYears}
                toggleYear={toggleYear}
            />
        </div>
    );

    const bookPage = (
        <BookSelectorPage
            selectedBooksRef={selectedBooksRef}
            years={selectedYears}
        />
    );

    const pages = isLoggedIn
        ? [
            <React.Fragment key="books">
                {hiddenFields}
                <HiddenContactInfo />
                {yearCheckboxes}
                {bookPage}
            </React.Fragment>
        ]
        : [
            <React.Fragment key="contact">
                {hiddenFields}
                {yearCheckboxes}
                <ContactInfo />
            </React.Fragment>,
            <React.Fragment key="books">
                {bookPage}
            </React.Fragment>
        ];

    return (
        <React.Fragment>
            <FormTarget />
            <MultiPageForm
                validatePage={validatePage}
                action={adoptionUrl}
                onPageChange={onPageChange}
                onSubmit={doSubmit}
                submitting={submitting}
                target="form-target"
            >
                {pages}
            </MultiPageForm>
        </React.Fragment>
    );
}

export default function AdoptionForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [hideRoleSelector, setHideRoleSelector] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const {userModel} = useUserContext();
    const isLoggedIn = Boolean(userModel?.last_name);
    const initialRender = useRef(true);
    const onPageChange = React.useCallback((page: number) => {
        setHideRoleSelector(page > 1);
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            ref.current?.scrollIntoView();
        }
    }, []);

    useDocumentHead({title: 'Adoption Form'});
    useCanonicalLink();

    return (
        <main className={`adoption-form-v2${isLoggedIn ? ' logged-in' : ''}`}>
            {isLoggedIn ? (
                <PersonalizedHeader />
            ) : (
                <FormHeader prefix="adoption" />
            )}
            <img
                className="strips"
                src="/dist/images/components/strips.svg"
                height="10"
                alt=""
                role="presentation"
            />
            <div className="text-content" ref={ref}>
                {isLoggedIn ? (
                    <FacultyForm
                        position={positionFromRole(userModel?.self_reported_role)}
                        onPageChange={onPageChange}
                    />
                ) : (
                    <RoleSelector
                        value={selectedRole}
                        setValue={setSelectedRole}
                        hidden={hideRoleSelector}
                    >
                        <StudentForm />
                        <FacultyForm
                            position={selectedRole}
                            onPageChange={onPageChange}
                        />
                    </RoleSelector>
                )}
            </div>
        </main>
    );
}
