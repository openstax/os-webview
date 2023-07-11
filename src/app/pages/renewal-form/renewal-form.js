import React from 'react';
import {useLocation} from 'react-router-dom';
import linkHelper from '~/helpers/link';
import useUserContext from '~/contexts/user';
import useAdoptions from '~/models/renewals';
import BookTagsMultiselect, {BookTagsContextProvider, useBookTagsContext}
    from '~/components/multiselect/book-tags/book-tags';

import './renewal-form.scss';

const MAX_SELECTIONS = 5;

// Bundle it up like a Context, but just pass it so I don't have to actually
// make a Context.
function useFormData(adoptions) {
    const defaultCount = React.useCallback(
        (bookValue) => {
            if (adoptions.Books) {
                const oldValue = adoptions.Books.find((b) => b.name === bookValue).students;
                const maxValue = Math.max(...adoptions.Books.map((b) => b.students));

                return oldValue || maxValue;
            }
            return 10;
        },
        [adoptions]
    );
    const [counts, setCounts] = React.useState({});
    const updateCount = React.useCallback(
        (bv, num) => {
            counts[bv] = num;
            setCounts({...counts});
        },
        [counts]
    );

    return {counts, updateCount, defaultCount};
}

function HiddenFields({email, uuid, counts}) {
    const {search} = useLocation();
    const params = new window.URLSearchParams(search);
    const fromValue = params.get('from');
    const hrefValue = params.get('href');
    const source = fromValue || 'email';
    const {selectedItems} = useBookTagsContext();
    const json = React.useMemo(
        () => JSON.stringify({
            'Books': selectedItems.map(
                ({value: name}) => ({name, students: +counts[name]})
            )
        }),
        [selectedItems, counts]
    );
    const subjects = React.useMemo(
        () => selectedItems ? selectedItems.map((i) => i.value).join(';') : '',
        [selectedItems]
    );

    return (
        <React.Fragment>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="renewal_date" value={new Date(Date.now()).toLocaleDateString()} />
            <input type="hidden" name="accounts_uuid" value={uuid} />
            <input type="hidden" name="application_source" value={source} />
            <input type="hidden" name="adoption_json" value={json} />
            <input type="hidden" name="subject" value={subjects} />
            <input type="hidden" name="subject_interest" value={subjects} />
            { hrefValue ?
                <input type="hidden" name="success_location" value={hrefValue} /> :
                null}
        </React.Fragment>
    );
}

function FixedField({label, name, value}) {
    return (
        <div className="fixed-field">
            <label>{label}:</label>{' '}
            <span>{value}</span>
            <input type="hidden" name={name} value={value} />
        </div>
    );
}

function Counts({counts, updateCount}) {
    const {selectedItems} = useBookTagsContext();

    return (
        <React.Fragment>
            <label>How many students use these books each semester?</label>
            <div className="student-counts">
                {
                    selectedItems.map((b) =>
                        <React.Fragment key={b.value}>
                            {b.text}{': '}
                            <input
                                type="number" value={counts[b.value]}
                                onChange={({target}) => updateCount(b.value, target.value)}
                                min="1" max="999"
                                required
                            />
                        </React.Fragment>
                    )
                }
            </div>
        </React.Fragment>
    );
}

function BooksAndStudentCounts({counts, updateCount}) {
    const {selectedItems} = useBookTagsContext();

    return (
        <div className="books-and-counts">
            <label>What books are you using?</label>
            <BookTagsMultiselect required oneField />
            <small>You may select up to {MAX_SELECTIONS}</small>
            {
                selectedItems.length ? <Counts counts={counts} updateCount={updateCount} /> : null
            }
        </div>
    );
}

function TheForm() {
    const {userStatus} = useUserContext();
    const {firstName, lastName, email, school, uuid} = userStatus || {};
    const adoptions = useAdoptions(uuid);
    const {counts, updateCount, defaultCount} = useFormData(adoptions);
    const {allBooks, select} = useBookTagsContext();
    const selectAndSetDefaultCount = React.useCallback(
        (item) => {
            select(item);
            if (!(item.value in counts)) {
                updateCount(item.value, defaultCount(item.value));
            }
        },
        [select, counts, updateCount, defaultCount]
    );
    const [initialized, setInitialized] = React.useState(false);

    // Initialize selections from adoptions
    React.useEffect(
        () => {
            if (!initialized && adoptions.Books) {
                for (const b of adoptions.Books) {
                    const item = allBooks.find((i) => i.value === b.name);

                    selectAndSetDefaultCount(item);
                }
                setInitialized(true);
            }
        },
        [adoptions, selectAndSetDefaultCount, allBooks, initialized]
    );

    return (
        <form action={window.SETTINGS.renewalEndpoint} method="post">
            <HiddenFields email={email} uuid={uuid} counts={counts} />
            <div className="fixed-fields">
                <FixedField label="First name" name="first_name" value={firstName} />
                <FixedField label="Last name" name="last_name" value={lastName} />
                <FixedField label="School name" name="school" value={school} />
            </div>
            <BooksAndStudentCounts counts={counts} updateCount={updateCount} />
            <input type="submit" />
        </form>
    );
}

function EnsureLoggedIn() {
    const {userStatus: {uuid}} = useUserContext();

    React.useEffect(
        () => {
            if (!uuid) {
                const t = window.setTimeout(
                    () => {window.location = linkHelper.loginLink();},
                    1000
                );

                return () => window.clearTimeout(t);
            }
            return null;
        },
        [uuid]
    );

    if (!uuid) {
        return (
            <div>You need to be logged in. Redirecting...</div>
        );
    }

    return (
        <BookTagsContextProvider maxSelections={MAX_SELECTIONS}>
            <TheForm />
        </BookTagsContextProvider>
    );
}

export default function RenewalForm() {
    return (
        <div className="renewal-form page">
            <div className="boxed">
                <h1>Adoption renewal</h1>
                <EnsureLoggedIn />
            </div>
        </div>
    );
}
