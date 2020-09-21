import React, {useRef} from 'react';
import {BookDetails} from '~/pages/details/details';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';
import rawEnglishData from '../../data/details-biology-2e';
import {transformData} from '~/helpers/controller/cms-mixin';
import rawPolishData from '../../data/details-polish';

let wrapper;
let rawData = rawEnglishData;

function WrappedDetailsPage() {
    const data = transformData(rawData);
    const ref = useRef();
    jest.spyOn(document, 'querySelector').mockImplementation(
        (selector) => ref.current
    );

    return (
        <div className="details-page" ref={ref}>
            <BookDetails data={data} />
        </div>
    );
}

beforeEach(function () {
    wrapper = makeMountRender(WrappedDetailsPage)();
});

describe('Book Details page', () => {
    const isActive = (rw) => rw.getDOMNode().getAttribute('aria-current') === 'page';

    it('has expected tabs', () => {
        const tabGroup = wrapper.find('.tab-group');
        const tabs = tabGroup.find('.tab');
        const firstTabEl = tabs.at(0).getDOMNode();
        const expectedLabels = ['Book details', 'Instructor resources', 'Student resources'];

        expect(tabs).toHaveLength(3);
        expectedLabels.forEach((label, i) => expect(tabs.at(i).text()).toBe(label));
    });
    it('selects clicked tabs', () => {
        const tabs = wrapper.find('.tab');

        expect(isActive(tabs.at(0))).toBe(true);
        expect(isActive(tabs.at(1))).toBe(false);
        tabs.at(1).simulate('click');
        expect(isActive(tabs.at(0))).toBe(false);
        expect(isActive(tabs.at(1))).toBe(true);
    });
    it('has expected accordion groups in mobile', () => {
        const accordionLabels = wrapper.find('.accordion-group .label');
        const expectedLabels = [
            'Book details',
            'Table of contents',
            'Instructor resourcesupdated', // this got the new callout
            'Student resources',
            'Report errata'
        ];

        expect(accordionLabels).toHaveLength(5);
        expectedLabels.forEach((label, i) => expect(accordionLabels.at(i).text()).toBe(label));
    });
    it('[use Polish data]', () => {
        rawData = rawPolishData;
    });
    it('has expected tab for Polish book', () => {
        const tabs = wrapper.find('.tab');

        expect(tabs.at(0).text()).toBe('Szczegóły książki');
        expect(tabs).toHaveLength(1);
    });
});
