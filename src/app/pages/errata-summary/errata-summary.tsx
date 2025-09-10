import React, {useState} from 'react';
import Hero from './hero/hero';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import Table from './table/table';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import './errata-summary.scss';

type RadioItem = {
    value: string;
    html: string;
};

type ErrataData = {
    id: string;
    created: string;
    resource: string;
    resourceOther?: string;
    errorType: string;
    errorTypeOther?: string;
    location: string;
    additionalLocationInformation?: string;
    detail: string;
    modified: string;
};

type ErrataSummaryProps = {
    data: ErrataData[];
    book: string;
};

const radioItems: RadioItem[] = [
    {value: '', html: 'View All'},
    {value: 'in-review', html: 'In Review'},
    {value: 'reviewed', html: 'Reviewed'},
    {value: 'corrected', html: 'Corrected'}
];

function ErrataSummary({data, book}: ErrataSummaryProps): React.ReactElement {
    const initialValue: string = window.location.hash.replace('#', '');
    const [selectedFilter, setselectedFilter] = useState<string>(initialValue);
    const onChange = React.useCallback(
        (newlySelectedValue: string) => {
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

export default function ErrataSummaryLoader(): React.ReactElement {
    const book: string | null = new window.URLSearchParams(window.location.search).get('book');
    const slug: string = `errata/?book_title=${book}` +
        '&is_assessment_errata__not=Yes&archived=False&status__not=New' +
        '&status__not=OpenStax%20Editorial%20Review';

    return (
        <main className="errata-summary page">
            <LoaderPage slug={slug} Child={ErrataSummary} props={{book: book || ''}} />
        </main>
    );
}