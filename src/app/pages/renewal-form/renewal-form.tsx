import React from 'react';
import {useLocation} from 'react-router-dom';
import linkHelper from '~/helpers/link';
import useUserContext from '~/contexts/user';
import useAdoptions, {Adoption} from '~/models/renewals';
import YearSelector from '~/components/year-selector/year-selector';
import TrackingParameters from '~/components/tracking-parameters/tracking-parameters';
import {WindowWithSettings} from '~/helpers/window-settings';
// -- We'll be trying to do this for the next release.
// import _adoptionsPromise from './salesforce-data';
import BookTagsMultiselect, {
    BookTagsContextProvider,
    useBookTagsContext
} from '~/components/multiselect/book-tags/book-tags';

import './renewal-form.scss';
import {SalesforceBook} from '~/helpers/books';

const MAX_SELECTIONS = 5;

type CountsType = Record<string, number>;

// Bundle it up like a Context, but just pass it so I don't have to actually
// make a Context.
function useFormData(adoptions?: Adoption) {
    // This will not be called unless adoptions is set and has books
    // See selectAndSetDefaultCount below
    const defaultCount = React.useCallback(
        (bookValue: string) =>
            adoptions!.Books.find((b) => b.name === bookValue)
                ?.students as number,
        [adoptions]
    );
    const [counts, setCounts] = React.useState<CountsType>({});
    const updateCount = React.useCallback(
        (bv: string, num: number) => {
            counts[bv] = num;
            setCounts({...counts});
        },
        [counts]
    );

    return {counts, updateCount, defaultCount};
}

function HiddenFields({
    email,
    uuid,
    counts,
    year
}: {
    email?: string;
    uuid?: string;
    counts: CountsType;
    year?: string;
}) {
    const {search} = useLocation();
    const params = new window.URLSearchParams(search);
    const fromValue = params.get('from');
    const returnToValue = params.get('returnTo');
    const source = fromValue || 'email';
    const {selectedItems} = useBookTagsContext();
    const json = React.useMemo(
        () =>
            JSON.stringify({
                Books: selectedItems.map(({value: name}) => ({
                    name,
                    students: +counts[name],
                    baseYear: year
                }))
            }),
        [selectedItems, counts, year]
    );
    const subjects = React.useMemo(
        () => selectedItems.map((i) => i.value).join(';'),
        [selectedItems]
    );

    return (
        <React.Fragment>
            <TrackingParameters source={source} />
            <input type="hidden" name="email" value={email} />
            <input
                type="hidden"
                name="renewal_date"
                value={new Date(Date.now()).toLocaleDateString()}
            />
            <input type="hidden" name="accounts_uuid" value={uuid} />
            <input type="hidden" name="adoption_json" value={json} />
            <input type="hidden" name="subject_interest" value={subjects} />
            {returnToValue ? (
                <input
                    type="hidden"
                    name="success_location"
                    value={returnToValue}
                />
            ) : null}
        </React.Fragment>
    );
}

function FixedField({
    label,
    name,
    value
}: {
    label: string;
    name: string;
    value?: string;
}) {
    return (
        <div className="fixed-field">
            <label>{label}:</label> <span>{value}</span>
            <input type="hidden" name={name} value={value} />
        </div>
    );
}

type CountUpdater = (bv: string, tv: number) => void;

function Counts({
    counts,
    updateCount
}: {
    counts: CountsType;
    updateCount: CountUpdater;
}) {
    const {selectedItems} = useBookTagsContext();

    return (
        <React.Fragment>
            <label>How many students use these books each semester?</label>
            <div className="student-counts">
                {selectedItems.map((b) => (
                    <React.Fragment key={b.value}>
                        {b.text}
                        {': '}
                        <input
                            type="number"
                            value={counts[b.value]}
                            onChange={({target}) =>
                                updateCount(b.value, Number(target.value))
                            }
                            min="1"
                            max="999"
                            required
                        />
                    </React.Fragment>
                ))}
            </div>
        </React.Fragment>
    );
}

function BooksAndStudentCounts({
    counts,
    updateCount
}: {
    counts: CountsType;
    updateCount: CountUpdater;
}) {
    const {selectedItems} = useBookTagsContext();

    return (
        <div className="books-and-counts">
            <label>What books are you using?</label>
            <BookTagsMultiselect required oneField />
            <small>You may select up to {MAX_SELECTIONS}</small>
            {selectedItems.length ? (
                <Counts counts={counts} updateCount={updateCount} />
            ) : null}
        </div>
    );
}

function TheForm() {
    const {userStatus} = useUserContext();
    const {firstName, lastName, email, school, uuid} = userStatus;
    const adoptions = useAdoptions(uuid);
    const {counts, updateCount, defaultCount} = useFormData(adoptions);
    const {allBooks, select} = useBookTagsContext();
    const selectAndSetDefaultCount = React.useCallback(
        (item: SalesforceBook) => {
            select(item);
            updateCount(item.value, defaultCount(item.value));
        },
        [select, updateCount, defaultCount]
    );
    const [initialized, setInitialized] = React.useState(false);
    const {search} = useLocation();
    const selectedYear = new window.URLSearchParams(search).get('year') ?? undefined;
    const [copyOfYear, setCopyOfYear] = React.useState<string>();
    const settings = (window as WindowWithSettings).SETTINGS;

    // Initialize selections from adoptions
    React.useEffect(() => {
        if (!initialized && adoptions) {
            for (const b of adoptions.Books) {
                const item = allBooks.find((i) => i.value === b.name);

                if (!item) {
                    return;
                }
                selectAndSetDefaultCount(item);
            }
            setInitialized(true);
        }
    }, [adoptions, selectAndSetDefaultCount, allBooks, initialized]);

    return (
        <form action={settings.renewalEndpoint} method="post">
            <HiddenFields email={email} uuid={uuid} counts={counts} year={copyOfYear} />
            <div className="fixed-fields">
                <FixedField
                    label="First name"
                    name="first_name"
                    value={firstName}
                />
                <FixedField
                    label="Last name"
                    name="last_name"
                    value={lastName}
                />
                <FixedField label="School name" name="school" value={school} />
            </div>
            {adoptions ? (
                <React.Fragment>
                    <YearSelector selectedYear={selectedYear} onValueUpdate={setCopyOfYear} />
                    <BooksAndStudentCounts
                        counts={counts}
                        updateCount={updateCount}
                    />
                </React.Fragment>
            ) : (
                <div>...fetching adoption info...</div>
            )}
            <input type="submit" disabled={!adoptions} />
        </form>
    );
}

function EnsureLoggedIn() {
    const {
        userStatus: {uuid}
    } = useUserContext();
    const defaultMsg = `Reporting your use of OpenStax helps us
    secure additional funding for future titles!`;
    const [adoptionInfo, _setAdoptionInfo] = React.useState(defaultMsg);

    React.useEffect(() => {
        if (!uuid) {
            const t = window.setTimeout(() => {
                window.location.assign(linkHelper.loginLink());
            }, 1000);

            return () => {
                window.clearTimeout(t);
            };
        }
        return undefined;
    }, [uuid]);

    if (!uuid) {
        return <div>You need to be logged in. Redirecting...</div>;
    }

    return (
        <BookTagsContextProvider maxSelections={MAX_SELECTIONS}>
            <div>{adoptionInfo}</div>
            <TheForm />
        </BookTagsContextProvider>
    );
}

export default function RenewalForm() {
    return (
        <div className="renewal-form page">
            <div className="boxed">
                <h1>What textbook(s) are you using?</h1>
                <EnsureLoggedIn />
            </div>
        </div>
    );
}
