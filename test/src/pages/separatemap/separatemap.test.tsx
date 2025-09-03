import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import SeparateMap from '~/pages/separatemap/separatemap';
import * as DH from '~/helpers/use-document-head';
import * as MD from '~/helpers/device';

const mockMapbox = jest.fn();
const mockQuerySchools = jest.fn();
const mockQueryById = jest.fn();
let mockOn: jest.Mock;
let mockRemove: jest.Mock;

jest.spyOn(DH, 'default').mockReturnValue();
const mockIsMobileDisplay = jest
    .spyOn(MD, 'isMobileDisplay')
    .mockReturnValue(false);

jest.mock('~/models/mapbox', () => () => mockMapbox());
jest.mock('mapbox-gl', () => {
    const functionWithThings = () => ({});

    functionWithThings.Map = jest.fn().mockReturnValue({
        on: (mockOn = jest.fn()),
        setFilter: jest.fn(),
        fitBounds: jest.fn()
    });
    functionWithThings.Popup = jest.fn().mockReturnValue({
        remove: (mockRemove = jest.fn()),
        setLngLat: jest.fn(),
        setHTML: jest.fn(),
        addTo: jest.fn()
    });
    functionWithThings.LngLatBounds = jest.fn().mockReturnValue({
        extend: jest.fn().mockReturnValue([0, 10])
    });

    return {
        __esModule: true,
        default: functionWithThings
    };
});
jest.mock('~/models/query-schools', () => ({
    __esModule: true,
    default: () => mockQuerySchools(),
    queryById: () => mockQueryById()
}));
jest.mock('~/helpers/main-class-hooks', () => ({
    __esModule: true,
    useMainModal: jest.fn()
}));

const aSchoolData = {
    cityState: 'Pomfret, Maryland',
    fields: {
        // eslint-disable-next-line camelcase
        salesforce_id: '0016f00002alpsuAAA',
        name: 'Maurice J. McDonough High School',
        phone: '(301) 934-2944',
        website: 'https://www.ccboe.com/schools/mcdonough/',
        type: 'High School'
    },
    institutionType: 'High School',
    institutionalPartner: false,
    lngLat: [-77.034, 38.555],
    pk: '656595',
    testimonial: {
        text: 'Good stuff',
        name: 'Some Body',
        position: 'Chief Example'
    }
};

describe('separatemap', () => {
    const user = userEvent.setup();

    mockMapbox.mockResolvedValue({
        name: 'mock-schools',
        style: 'mapbox-style'
    });
    mockQuerySchools.mockResolvedValue({TOO_MANY: true});

    it('renders; popup dismisses', async () => {
        render(<SeparateMap />);
        await user.click(
            await screen.findByRole('button', {name: 'close popup'})
        );
        expect(screen.queryByRole('button', {name: 'close popup'})).toBeNull();
    });
    it('handles school click', async () => {
        mockOn.mockImplementation(
            (eType: string, what: string, fn: (el: object) => void) => {
                if (eType === 'click' && what === 'os-schools') {
                    fn({
                        features: [
                            {
                                properties: {
                                    id: 1
                                }
                            }
                        ]
                    });
                }
            }
        );
        mockQueryById.mockResolvedValue(null);
        // cover mapZoom branch
        mockIsMobileDisplay.mockReturnValue(true);
        render(<SeparateMap />);
        await waitFor(() => expect(mockQueryById).toHaveBeenCalled());

        const mapd = document.getElementById('mapd') as HTMLElement;

        mapd.innerHTML = `<div class="mapboxgl-popup-content">
            <div class="put-away">
                <button>Test put-away</button>
            </div>
        </div>`;

        await user.click(screen.getByRole('button', {name: 'Test put-away'}));
        expect(mockRemove).toHaveBeenCalled();
        mockRemove.mockClear();
        await user.click(mapd);
        expect(mockRemove).not.toHaveBeenCalled();
    });
    it('interacts with search box', async () => {
        mockQuerySchools.mockResolvedValue([aSchoolData]);

        render(<SeparateMap />);
        const inputs = await screen.findAllByRole('textbox');

        await user.type(inputs[0], 'Test{enter}');
        await user.click(screen.getByRole('switch'));
    });
    it('handles too many search results', async () => {
        mockQuerySchools.mockResolvedValue({TOO_MANY: true});

        render(<SeparateMap />);
        const inputs = await screen.findAllByRole('textbox');

        await user.type(inputs[0], 'Test{enter}');
        expect(screen.queryByRole('switch')).toBeNull();
    });
    it('handles filter checkboxes; school query returns no promise', async () => {
        mockQueryById.mockClear();
        mockQuerySchools.mockReturnValue(null);
        render(<SeparateMap />);
        await screen.findAllByRole('textbox');
        await user.click(screen.getByRole('button', {name: 'Filter by'}));
        await user.click(screen.getAllByRole('checkbox')[0]);
        expect(mockQueryById).toHaveBeenCalledTimes(1);
        // Exercises checkbox unselect code in filters.tsx
        await user.click(screen.getAllByRole('checkbox')[0]);
        // Exercise institution selector
        const select = screen.getByRole('combobox');

        expect(select.textContent).toBe('Any');
        await user.click(select);
        await user.click(screen.getByRole('option', {name: 'High School'}));
        expect(select.textContent).toBe('High School');
    });
    it('handles school query returning no schools', async () => {
        mockQuerySchools.mockResolvedValue([]);
        mockQueryById.mockResolvedValue(null);
        render(<SeparateMap />);
        const inputs = await screen.findAllByRole('textbox');

        await user.type(inputs[0], 'Test{enter}');
        expect(screen.queryByRole('switch')).toBeNull();
    });
    it('handles school match and when all schools are filtered out', async () => {
        mockQuerySchools.mockResolvedValue([aSchoolData]);
        mockQueryById.mockResolvedValue(aSchoolData);
        render(<SeparateMap />);
        const inputs = await screen.findAllByRole('textbox');

        await user.type(inputs[0], 'Test{enter}');
        mockQuerySchools.mockResolvedValue([]);
        // select/open/fly-to
        await user.click(screen.getByRole('switch'));
        await user.type(inputs[0], 'Oops{enter}');
        // unselect/close/fly-out-from
        await user.click(screen.getByRole('switch'));
        await user.click(
            screen.getAllByRole('button', {name: 'clear search'})[0]
        );
        // Clear search button goes away when search is cleared
        expect(screen.queryByRole('button', {name: 'clear search'})).toBeNull();
    });
    it('toggles search window open/closed', async () => {
        render(<SeparateMap />);
        const toggle = screen.getAllByRole('button', {
            name: 'toggle search window'
        })[0];

        expect(toggle.getAttribute('aria-pressed')).toBe('false');
        await user.click(toggle);
        expect(toggle.getAttribute('aria-pressed')).toBe('true');
        await user.click(toggle);
        expect(toggle.getAttribute('aria-pressed')).toBe('false');
    });
});
