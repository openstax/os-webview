import React from 'react';
import {useLocation} from 'react-router-dom';
import useUserContext from '~/contexts/user';
import fetchBooks, {salesforceTitles} from '~/models/books';
import BookTagsMultiselect from '~/components/multiselect/book-tags/book-tags';
import './renewal-form.scss';

// Bundle it up like a Context, but just pass it so I don't have to actually
// make a Context.
function useFormData() {
    const [selectedBooks, setSelectedBooks] = React.useState([]);
    const defaultCount = React.useMemo(
        () => 10, // TODO get right default;
        []
    );
    const [counts, setCounts] = React.useState({});
    const updateCount = React.useCallback(
        (bv, num) => {
            counts[bv] = num;
            setCounts({...counts});
        },
        [counts]
    );
    const json = React.useMemo(
        () => JSON.stringify({
            'Books': selectedBooks.map(
                ({value: name}) => ({name, students: +counts[name]})
            )
        }),
        [selectedBooks, counts]
    );

    React.useEffect(
        () => {
            selectedBooks.forEach(
                (b) => {
                    if (!(b.value in counts)) {
                        updateCount(b.value, defaultCount);
                    }
                }
            );
        },
        [selectedBooks, defaultCount, counts, updateCount]
    );

    return {
        selectedBooks,
        setSelectedBooks,
        counts,
        updateCount,
        json
    };
}

function HiddenFields({email, uuid, formData: {json}}) {
    const {search} = useLocation();
    const fromValue = new window.URLSearchParams(search).get('from');
    const source = fromValue || 'email';

    return (
        <React.Fragment>
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="renewal_date" value={new Date(Date.now()).toLocaleDateString()} />
            <input type="hidden" name="accounts_uuid" value={uuid} />
            <input type="hidden" name="appplication_source" value={source} />
            <input type="hidden" name="adoption_json" value={json} />
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

function useSFBooks() {
    const [sfTitles, setSfTitles] = React.useState([]);

    React.useMemo(
        () => fetchBooks.then(salesforceTitles).then(setSfTitles),
        []
    );

    return sfTitles;
}

function Counts({formData: {selectedBooks, counts, updateCount}}) {
    return (
        <React.Fragment>
            <label>How many students use these books each semester?</label>
            <div className="student-counts">
                {
                    selectedBooks.map((b) =>
                        <React.Fragment key={b.value}>
                            {b.text}{': '}
                            <input
                                type="number" value={counts[b.value]}
                                onChange={({target}) => updateCount(b.value, target.value)} />
                        </React.Fragment>
                    )
                }
            </div>
        </React.Fragment>
    );
}

function BooksAndStudentCounts({formData}) {
    const {
        selectedBooks: sv,
        setSelectedBooks: setSv
    } = formData;
    const sfBooks = useSFBooks();

    return (
        <div className="books-and-counts">
            <label>What books are you using?</label>
            <BookTagsMultiselect
                required
                selected={sv} oneField
                booksAllowed={sfBooks.map((b) => b.value)}
                onChange={setSv}
            />
            {
                sv.length ? <Counts formData={formData} /> : null
            }
        </div>
    );
}

export default function RenewalForm() {
    const {userStatus, ...other} = useUserContext();
    const {firstName, lastName, email, school, uuid} = userStatus || {};
    const formData = useFormData();

    console.info('Other info (contact/renewal_eligible?)', other);
    return (
        <div className="renewal-form page">
            <div className="boxed">
                <h1>Renew this</h1>
                <form>
                    <HiddenFields email={email} uuid={uuid} formData={formData} />
                    <div className="fixed-fields">
                        <FixedField label="First name" name="first_name" value={firstName} />
                        <FixedField label="Last name" name="last_name" value={lastName} />
                        <FixedField label="School name" name="school_name" value={school} />
                    </div>
                    <BooksAndStudentCounts formData={formData} />
                    <input type="submit" />
                </form>
            </div>
        </div>
    );
}
