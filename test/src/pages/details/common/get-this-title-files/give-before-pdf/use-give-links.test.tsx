import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import useGiveLink, {
    placementFromSearch,
    Placement,
    useResolvedGiveLink
} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-give-links';

jest.mock('@openstax/experiments', () => ({
    enroll: jest.fn(({variants}) => variants[0])
}));

const saveFetch = global.fetch;

/* eslint-disable camelcase */
function makeRow(overrides: Partial<{
    placement: Placement;
    variant: string;
    url: string;
    header_subtitle: string;
    give_link_text: string;
    is_active: boolean;
}> = {}) {
    return {
        placement: 'pdf' as Placement,
        variant: 'control',
        url: 'https://give.example/control',
        header_subtitle: '',
        give_link_text: '',
        is_active: true,
        ...overrides
    };
}
/* eslint-enable camelcase */

function mockDonationLinks(rows: unknown) {
    global.fetch = jest
        .fn()
        .mockImplementation((...args: Parameters<typeof saveFetch>) => {
            const url = args[0] as string;

            if (url.includes('donation-links')) {
                return Promise.resolve({json: () => Promise.resolve(rows)});
            }
            return saveFetch(...args);
        });
}

function Probe({placement, path = '/'}: {placement: Placement; path?: string}) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <ProbeContent placement={placement} />
        </MemoryRouter>
    );
}

function ProbeContent({placement}: {placement: Placement}) {
    const link = useGiveLink(placement);

    return (
        <div data-testid="link">
            {link ? `${link.url}|${link.headerSubtitle}` : 'none'}
        </div>
    );
}

describe('useGiveLink', () => {
    let enrollSpy: jest.Mock;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        enrollSpy = require('@openstax/experiments').enroll;
        enrollSpy.mockClear();
    });

    afterEach(() => {
        global.fetch = saveFetch;
    });

    it('enrolls and renders one of two rows for a placement', async () => {
        const rows = [
            makeRow({variant: 'control', url: 'https://give.example/control'}),
            makeRow({variant: 'public good', url: 'https://give.example/public-good'})
        ];

        mockDonationLinks(rows);
        render(<Probe placement="pdf" />);
        await screen.findByText('https://give.example/control|');
        expect(enrollSpy).toHaveBeenCalledTimes(1);
        const arg = enrollSpy.mock.calls[0][0];

        expect(arg.name).toBe('Donation Popup Link');
        expect(arg.variants.map((v: {name: string}) => v.name)).toEqual(['control', 'public good']);
    });

    it('renders the only row for a placement without enrolling', async () => {
        mockDonationLinks([makeRow({url: 'https://give.example/solo'})]);
        render(<Probe placement="pdf" />);
        await screen.findByText('https://give.example/solo|');
        expect(enrollSpy).not.toHaveBeenCalled();
    });

    it('returns null when the CMS request fails', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('network down'));
        render(<Probe placement="pdf" />);
        await screen.findByText('none');
        expect(enrollSpy).not.toHaveBeenCalled();
    });

    it('returns null when the CMS returns no rows for the placement', async () => {
        mockDonationLinks([makeRow({placement: 'other'})]);
        render(<Probe placement="pdf" />);
        await screen.findByText('none');
        expect(enrollSpy).not.toHaveBeenCalled();
    });

    it('picks the resource placement contextually over the default', async () => {
        mockDonationLinks([
            makeRow({placement: 'pdf', url: 'https://give.example/pdf'}),
            makeRow({placement: 'instructor_resources', url: 'https://give.example/instructor'})
        ]);
        render(<Probe placement="pdf" path="/details/some-book?Instructor resources" />);
        await screen.findByText('https://give.example/instructor|');
    });
});

/* eslint-disable camelcase */
const fallbackData = {
    give_link: 'https://fallback.example/give',
    header_subtitle: 'fallback subtitle',
    give_link_text: 'Give $25'
};
/* eslint-enable camelcase */

function ResolvedProbe({placement}: {placement: Placement}) {
    return (
        <MemoryRouter initialEntries={['/']}>
            <ResolvedProbeContent placement={placement} />
        </MemoryRouter>
    );
}

function ResolvedProbeContent({placement}: {placement: Placement}) {
    const {giveLinkText} = useResolvedGiveLink(placement, fallbackData);

    return <div data-testid="give-link-text">{giveLinkText}</div>;
}

describe('useResolvedGiveLink', () => {
    afterEach(() => {
        global.fetch = saveFetch;
    });

    it("renders the chosen variant's own give link text when set", async () => {
        mockDonationLinks([makeRow({give_link_text: 'Give $50'})]);
        render(<ResolvedProbe placement="pdf" />);
        await screen.findByText('Give $50');
    });

    it("falls back to the popup's give link text when the variant's is blank", async () => {
        mockDonationLinks([makeRow({give_link_text: ''})]);
        render(<ResolvedProbe placement="pdf" />);
        await screen.findByText('Give $25');
    });

    it("falls back to the popup's give link text when the CMS request fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('network down'));
        render(<ResolvedProbe placement="pdf" />);
        await screen.findByText('Give $25');
    });
});

describe('placementFromSearch', () => {
    it('detects instructor resources', () => {
        expect(placementFromSearch('?Instructor resources')).toBe('instructor_resources');
    });

    it('detects student resources', () => {
        expect(placementFromSearch('?Student resources')).toBe('student_resources');
    });

    it('is case-insensitive', () => {
        expect(placementFromSearch('?INSTRUCTOR RESOURCES')).toBe('instructor_resources');
    });

    it('returns null when neither key is present', () => {
        expect(placementFromSearch('')).toBeNull();
        expect(placementFromSearch('?something=else')).toBeNull();
    });
});
