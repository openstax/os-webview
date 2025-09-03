import createMap from '~/pages/separatemap/map-api';
import {waitFor} from '@testing-library/preact';
import type {AugmentedInfo} from '~/models/query-schools';

const triggers: Record<string, (el?: object) => void> = {};
let mockLoaded: jest.Mock;
let mockResize: jest.Mock;
let mockSetFilter: jest.Mock;

jest.mock('~/models/mapbox', () => () => console.info('*** LOADED?'));
jest.mock('mapbox-gl', () => {
    const functionWithThings = () => ({});
    const mockMap = {
        on: (...args: unknown[]) => {
            const fn = args.pop() as () => void;

            (args as string[]).forEach((t) => {
                triggers[t] = fn;
            });
        },
        loaded: (mockLoaded = jest.fn().mockReturnValue(true)),
        resize: (mockResize = jest.fn()),
        getCanvas: () => ({style: {}}),
        setFilter: (mockSetFilter = jest.fn()),
        easeTo: jest.fn(),
        fitBounds: jest.fn()
    };

    functionWithThings.Map = jest.fn().mockReturnValue(mockMap);
    functionWithThings.Popup = jest.fn().mockReturnValue({
        remove: jest.fn()
    });
    functionWithThings.LngLatBounds = jest.fn().mockReturnValue({
        extend: jest.fn().mockReturnValue([0, 10])
    });

    return {
        __esModule: true,
        default: functionWithThings
    };
});

describe('map-api', () => {
    it('sets up event handlers', async () => {
        const container = document.createElement('div');
        const {tooltip} = createMap({container});

        await waitFor(() => expect(triggers.load).toBeTruthy());
        triggers.load();
        expect(mockLoaded).toHaveBeenCalled();
        expect(mockResize).toHaveBeenCalled();
        triggers.mouseenter();
        triggers.mouseleave();
        triggers.click({});
        expect(tooltip.remove).toHaveBeenCalled();
        (tooltip.remove as jest.Mock).mockReset();
        triggers.click({features: true});
        expect(tooltip.remove).not.toHaveBeenCalled();
    });
    it('shows tooltip for school', async () => {
        const container = document.createElement('div');
        const {loaded, tooltip, showTooltip} = createMap({container});
        const schoolInfo = {
            lngLat: [1, 2],
            fields: {
                name: 'Test University'
            },
            cityState: 'Smallville, KS'
        } as unknown as AugmentedInfo;

        await loaded;
        tooltip.setLngLat = jest.fn();
        tooltip.setHTML = jest.fn();
        tooltip.addTo = jest.fn();
        showTooltip(schoolInfo);
        expect(tooltip.setLngLat).toHaveBeenCalledWith(schoolInfo.lngLat);
        expect(tooltip.setHTML).toHaveBeenCalledWith(
            expect.stringContaining(schoolInfo.cityState)
        );
        // Handles empty cityState
        schoolInfo.cityState = '';
        showTooltip(schoolInfo);
        expect(tooltip.setHTML).toHaveBeenCalledWith(
            expect.not.stringMatching('<br>')
        );
        // Does not display if no lngLat
        jest.clearAllMocks();
        delete schoolInfo.lngLat;
        showTooltip(schoolInfo);
        expect(tooltip.setLngLat).not.toHaveBeenCalled();
        expect(tooltip.setHTML).not.toHaveBeenCalled();
    });
    it('shows points of schools', async () => {
        const container = document.createElement('div');
        const {loaded, showPoints} = createMap({container});
        const schoolInfo = {
            lngLat: [1, 2],
            fields: {
                name: 'Test University'
            },
            cityState: 'Smallville, KS'
        } as unknown as AugmentedInfo;

        await loaded;
        // Handles empty list (lnglat of 0, 0 gets filtered out)
        showPoints([{...schoolInfo, lngLat: [0, 0]}]);
        await waitFor(() =>
            expect(mockSetFilter).toHaveBeenCalledWith('os-schools', undefined)
        );
        mockSetFilter.mockClear();
        // Non-empty
        showPoints([schoolInfo]);
        await waitFor(() =>
            expect(mockSetFilter).toHaveBeenCalledWith('os-schools', [
                'in',
                'id',
                undefined
            ])
        );
        mockSetFilter.mockClear();
    });
});
