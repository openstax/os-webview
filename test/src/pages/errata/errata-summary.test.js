import ErrataSummary from '~/pages/errata-summary/errata-summary';
import Table from '~/pages/errata-summary/table/table';
import instanceReady from '../../../helpers/instance-ready';
import {clickElement, doKeyDown} from '../../../test-utils';

const searchStr = '/errata/?book=Anatomy%20and%20Physiology';
let tableProps;

describe('ErrataSummary', () => {
    window.history.pushState('', '', searchStr);
    const {instance, ready} = instanceReady(ErrataSummary);
    const tableRowCount = () => instance.el.querySelectorAll('.summary-table tr').length;

    it('creates', () => {
        expect(instance).toBeTruthy();
        expect(instance.slug).toMatch('Anatomy');
    });
    it('shows all items in table', () => {
        return instance.dataLoaded.then(() => {
            expect(instance.selectedFilter).toBe('');
            tableProps = instance.tableProps();
            expect(tableRowCount()).toBe(1 + tableProps.filteredErrataEntries.length);
        });
    });
    it('filters for each filter', () => {
        const filters = [
            {value: 'in-review', number: 19},
            {value: 'reviewed', number: 5},
            {value: 'corrected', number: 32}
        ];

        filters.forEach((obj) => {
            const btn = instance.el.querySelector(`.filter-button[data-value="${obj.value}"]`);

            expect(btn).toBeTruthy();
            clickElement(btn);
            expect(tableRowCount()).toBe(obj.number);
        });
    });
});

const tableData = [
    {
        id: 6224,
        created: '2018-05-30T13:03:24.896879-05:00',
        modified: '2018-05-30T15:12:42.805507-05:00',
        book: 130,
        status: 'Editorial Review',
        resolution: null,
        reviewed_date: null,
        corrected_date: null,
        archived: false,
        is_assessment_errata: 'No',
        location: '4.2',
        detail: 'Problems 87 and 93 have the slopes graphed incorrectly in both the online version and the printable version.',
        short_detail: 'Problems 87 and 93 have the slopes graphed incorrectly in both the online version and ...',
        resolution_date: null,
        resolution_notes: '',
        error_type: 'Incorrect answer, calculation, or solution',
        error_type_other: null,
        resource: 'iBooks version',
        resource_other: null,
        submitted_by_account_id: 56329,
        file_1: null,
        file_2: null,
        displayStatus: 'In Review',
        barStatus: '',
        date: '2018-5-30',
        source: 'iBooks version'
    },
    {
        id: 4613,
        created: '2017-11-24T17:02:45.977081-06:00',
        modified: '2017-12-07T10:43:06.778966-06:00',
        book: 130,
        status: 'Completed',
        resolution: 'Major Book Revision',
        reviewed_date: null,
        corrected_date: '2017-12-07',
        archived: false,
        is_assessment_errata: 'No',
        location: 'Section 7.6',
        detail: '(PDF version) Example 7.79: solution explanation in 2nd line has missing letter: "fir t" (missing "s" from "first").',
        short_detail: '(PDF version) Example 7.79: solution explanation in 2nd line has missing letter: "fir t" (missing ...',
        resolution_date: '2017-12-07',
        resolution_notes: 'While we cannot correct this particular kind of typo at this time, this is a known technical issue that we are working to resolve.',
        error_type: 'Typo',
        error_type_other: null,
        resource: 'Textbook',
        resource_other: null,
        submitted_by_account_id: 65868,
        file_1: null,
        file_2: null,
        displayStatus: 'No Correction',
        barStatus: 'No Correction',
        date: '2017-11-24',
        source: 'Textbook'
    },
    {
        id: 3622,
        created: '2017-08-02T01:39:11.275112-05:00',
        modified: '2018-03-07T16:54:20.446703-06:00',
        book: 130,
        status: 'Completed',
        resolution: 'Approved',
        reviewed_date: '2017-11-17',
        corrected_date: '2018-03-07',
        archived: false,
        is_assessment_errata: 'No',
        location: 'Ch 1: Foundations, Sec 1: Introduction to Whole Numbers, Table 1.4',
        detail: 'Column Counting Number 7, Row Multiples of 10\r\n\r\nshould be 70, not 0.',
        short_detail: 'Column Counting Number 7, Row Multiples of 10 should be 70, not 0.',
        resolution_date: '2018-03-07',
        resolution_notes: 'In Table 1.4, revise row "multiples of 10" under column "7" from "0" to "70".',
        error_type: null,
        error_type_other: null,
        resource: 'Textbook',
        resource_other: null,
        submitted_by_account_id: 161268,
        file_1: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/errata/user_uploads/1/pg10-11.png',
        file_2: null,
        displayStatus: 'Corrected 2018-3-7 in web view',
        barStatus: 'Corrected',
        date: '2017-8-2',
        source: 'Textbook'
    }
];

describe('ErrataSummary/Table', () => {
    const instance = new Table({
        filteredErrataEntries: tableData
    });
    const tableRowCount = () => instance.el.querySelectorAll('.summary-table tr').length;

    it('initially sorts by date', () => {
        expect(instance.sortKey).toBe('date');
        expect(instance.sortFn).toBe('sortDate');
    });
    it('handles id header clicks', () => {
        const idHeader = instance.el.querySelector('[data-sort-key="id"]');

        clickElement(idHeader);
        expect(instance.sortKey).toBe('id');
        expect(instance.sortFn).toBe('sortNumber');
        expect(instance.sortDir).toBe(1);
        clickElement(idHeader);
        expect(instance.sortDir).toBe(-1);
    });
    it('handles keydown in header', () => {
        const etHeader = instance.el.querySelector('[data-sort-key="error_type"]');
        const dHeader = instance.el.querySelector('[data-sort-key="displayStatus"]');

        doKeyDown(etHeader, 'Enter');
        expect(instance.sortKey).toBe('error_type');
        expect(instance.sortDir).toBe(1);
        expect(dHeader).toBeTruthy();
        doKeyDown(dHeader, 'Enter');
        expect(instance.sortKey).toBe('displayStatus');
        expect(instance.sortFn).toBe('sortDecision');
    });
});
