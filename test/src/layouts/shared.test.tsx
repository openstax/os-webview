import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {
    useFilteredBanners,
    useSelectedBanner,
    BannerInfo
} from '~/layouts/default/shared';

jest.mock('@openstax/experiments', () => ({
    enroll: jest.fn(({variants}) => variants[0])
}));

/* eslint-disable camelcase */
function makeBanner(overrides: Partial<BannerInfo> = {}): BannerInfo {
    return {
        id: 1,
        name: 'Banner',
        html_message: 'msg',
        link_text: null,
        link_url: null,
        is_active: true,
        start_date: null,
        end_date: null,
        context_filter: 'all',
        url_pattern: null,
        ...overrides
    };
}
/* eslint-enable camelcase */

function FilterProbe({banners}: {banners: BannerInfo[] | null | undefined}) {
    const filtered = useFilteredBanners(banners);

    return <div data-testid="names">{filtered.map((b) => b.name).join(',')}</div>;
}

function filterNamesAt(path: string, banners: BannerInfo[] | null | undefined) {
    const {container, unmount} = render(
        <MemoryRouter initialEntries={[path]}>
            <FilterProbe banners={banners} />
        </MemoryRouter>
    );
    const text = container.querySelector('[data-testid="names"]')?.textContent ?? '';

    unmount();
    return text;
}

describe('useFilteredBanners', () => {
    it('returns [] when bannerConfigs is null or empty', () => {
        expect(filterNamesAt('/anywhere', null)).toBe('');
        expect(filterNamesAt('/anywhere', [])).toBe('');
    });

    it('"all" matches every route', () => {
        // eslint-disable-next-line camelcase
        const banners = [makeBanner({name: 'A', context_filter: 'all'})];

        expect(filterNamesAt('/some/random/path', banners)).toBe('A');
    });

    it('"subjects" only matches /subjects routes', () => {
        // eslint-disable-next-line camelcase
        const banners = [makeBanner({name: 'S', context_filter: 'subjects'})];

        expect(filterNamesAt('/subjects/math', banners)).toBe('S');
        expect(filterNamesAt('/details/books/anatomy', banners)).toBe('');
    });

    it('"book_details" only matches /details/books/ routes', () => {
        // eslint-disable-next-line camelcase
        const banners = [makeBanner({name: 'BD', context_filter: 'book_details'})];

        expect(filterNamesAt('/details/books/anatomy', banners)).toBe('BD');
        expect(filterNamesAt('/subjects/math', banners)).toBe('');
    });

    it('"homepage" only matches /', () => {
        // eslint-disable-next-line camelcase
        const banners = [makeBanner({name: 'HP', context_filter: 'homepage'})];

        expect(filterNamesAt('/', banners)).toBe('HP');
        expect(filterNamesAt('/subjects', banners)).toBe('');
    });

    it('"blog" only matches /blog routes', () => {
        // eslint-disable-next-line camelcase
        const banners = [makeBanner({name: 'BL', context_filter: 'blog'})];

        expect(filterNamesAt('/blog/some-post', banners)).toBe('BL');
        expect(filterNamesAt('/', banners)).toBe('');
    });

    it('"url_pattern" uses regex for full-path matching; ignores null and invalid patterns', () => {
        /* eslint-disable camelcase */
        const banners = [
            makeBanner({name: 'Exact', context_filter: 'url_pattern', url_pattern: '/foo'}),
            makeBanner({name: 'Wildcard', context_filter: 'url_pattern', url_pattern: '/foo.*'}),
            makeBanner({name: 'Empty', context_filter: 'url_pattern', url_pattern: null}),
            makeBanner({name: 'Invalid', context_filter: 'url_pattern', url_pattern: '[foo'})
        ];
        /* eslint-enable camelcase */

        expect(filterNamesAt('/foo', banners)).toBe('Exact,Wildcard');
        expect(filterNamesAt('/foo/bar', banners)).toBe('Wildcard');
        expect(filterNamesAt('/other', banners)).toBe('');
    });

    it('returns nothing for unknown context_filter values', () => {
        // eslint-disable-next-line camelcase
        expect(filterNamesAt('/whatever', [makeBanner({context_filter: 'something-else'})])).toBe('');
    });

    it('filters multiple banners simultaneously', () => {
        /* eslint-disable camelcase */
        const banners = [
            makeBanner({name: 'A', context_filter: 'all'}),
            makeBanner({name: 'B', context_filter: 'blog'}),
            makeBanner({name: 'C', context_filter: 'subjects'})
        ];
        /* eslint-enable camelcase */

        expect(filterNamesAt('/blog/post', banners)).toBe('A,B');
    });
});

function SelectProbe({banners}: {banners: BannerInfo[]}) {
    const selected = useSelectedBanner(banners);

    return <div data-testid="selected">{selected?.name ?? 'none'}</div>;
}

describe('useSelectedBanner', () => {
    let enrollSpy: jest.Mock;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        enrollSpy = require('@openstax/experiments').enroll;
        enrollSpy.mockClear();
    });

    it('returns null for an empty list and does not enroll', () => {
        render(<SelectProbe banners={[]} />);
        expect(screen.getByTestId('selected')).toHaveTextContent('none');
        expect(enrollSpy).not.toHaveBeenCalled();
    });

    it('returns the only banner without enrolling when length is 1', () => {
        render(<SelectProbe banners={[makeBanner({name: 'Solo'})]} />);
        expect(screen.getByTestId('selected')).toHaveTextContent('Solo');
        expect(enrollSpy).not.toHaveBeenCalled();
    });

    it('enrolls when 2+ banners are available', () => {
        const banners = [makeBanner({name: 'A'}), makeBanner({id: 2, name: 'B'})];

        render(<SelectProbe banners={banners} />);
        expect(enrollSpy).toHaveBeenCalledTimes(1);
        const arg = enrollSpy.mock.calls[0][0];

        expect(arg.name).toBe('Site Banner Campaign');
        expect(arg.variants).toHaveLength(2);
        expect(arg.variants.map((v: {name: string}) => v.name)).toEqual(['A', 'B']);
        expect(screen.getByTestId('selected')).toHaveTextContent('A');
    });
});
