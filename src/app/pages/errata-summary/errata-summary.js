import React, {useState} from 'react';
import Hero from './hero/hero';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import Table from './table/table';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './errata-summary.scss';

const radioItems = [
    {value: '', html: 'View All'},
    {value: 'in-review', html: 'In Review'},
    {value: 'reviewed', html: 'Reviewed'},
    {value: 'corrected', html: 'Corrected'}
];

function ErrataSummary({data, book}) {
    const initialValue = window.location.hash.replace('#', '');
    const [selectedFilter, setselectedFilter] = useState(initialValue);
    const onChange = React.useCallback(
        (newlySelectedValue) => {
            setselectedFilter(newlySelectedValue);
            history.replaceState('', '',
                newlySelectedValue ? `#${newlySelectedValue}` :
                    window.location.href.replace(window.location.hash, '')
            );
        },
        []
    );

    return (
        <React.Fragment>
            <Hero book={book} />
            <div className="strips-and-filter">
                <img
                    className="strips" src="/dist/images/components/strips2.png"
                    height="10" alt="" role="presentation"
                />
                <div className="filter">
                    <RadioPanel
                        items={radioItems}
                        selectedItem={selectedFilter}
                        onChange={onChange}
                    />
                </div>
            </div>
            <Table data={data} filter={selectedFilter} />
        </React.Fragment>
    );
}

export default function ErrataSummaryLoader() {
    const book = new window.URLSearchParams(window.location.search).get('book');
    const slug = `errata/?book_title=${book}` +
        '&is_assessment_errata__not=Yes&archived=False&status__not=New' +
        '&status__not=OpenStax%20Editorial%20Review';

    return (
        <main className="errata-summary page">
            <LoaderPage slug={slug} Child={ErrataSummary} props={{book}} />
        </main>
    );
}
