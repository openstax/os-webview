import {pageWrapper} from '~/controllers/jsx-wrapper';
import React, {useState, useEffect} from 'react';
import $ from '~/helpers/$';
import routerBus from '~/helpers/router-bus';
import Hero from './hero/hero';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import Table from './table/table';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './errata-summary.css';

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
                window.location.href.replace(location.hash, '')
        );
    }

    return (
        <React.Fragment>
            <Hero book={book} />
            <div className="strips-and-filter">
                <img
                    class="strips" src="/images/components/strips2.png"
                    height="10" alt="" role="presentation"
                />
                <div class="filter">
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

export function ErrataSummaryLoader() {
    const book = $.parseSearchString(window.location.search).book[0];
    const slug = `errata/?book_title=${book}&is_assessment_errata__not=Yes&archived=False`;

    console.info(`Book: ${book}; Slug: ${slug}`);
    return (
        <LoaderPage slug={slug} Child={ErrataSummary} props={{book}} />
    );
}

const view = {
    classes: ['errata-summary', 'page'],
    tag: 'main' // if the HTML doesn't contain a main tag
};

export default pageWrapper(ErrataSummaryLoader, view);
