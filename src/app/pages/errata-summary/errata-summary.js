import React, {useState} from 'react';
import $ from '~/helpers/$';
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

    function onChange(newlySelectedValue) {
        setselectedFilter(newlySelectedValue);
        history.replaceState('', '',
            newlySelectedValue ? `#${newlySelectedValue}` :
                window.location.href.replace(window.location.hash, '')
        );
    }

    return (
        <React.Fragment>
            <Hero book={book} />
            <div className="strips-and-filter">
                <img
                    className="strips" src="/images/components/strips2.png"
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
    const book = $.parseSearchString(window.location.search).book[0];
    const slug = `errata/?book_title=${book}&is_assessment_errata__not=Yes&archived=False&status__not=New`;

    return (
        <main className="errata-summary page">
            <LoaderPage slug={slug} Child={ErrataSummary} props={{book}} />
        </main>
    );
}
