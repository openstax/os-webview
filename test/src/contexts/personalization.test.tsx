import React from 'react';
import {render, screen} from '@testing-library/preact';
import * as UC from '~/contexts/user';
import {
    PersonalizationContextProvider,
    usePersonalization
} from '~/contexts/personalization';
import {clearPersonalizationCache} from '~/models/personalization';

const mockFetch = jest.fn();

global.fetch = mockFetch;

/* eslint-disable camelcase */
const payload = {
    v: 1,
    logged_in: true,
    audience: 'instructor',
    segments: ['role:instructor', 'status:verified'],
    first_name: 'Roy',
    school: {id: 's1', name: 'Rice', type: null, assignable_stage: null},
    adoption: {state: 'current', base_year: 2026, last_confirmed_base_year: 2026, books: ['Physics']},
    assignable: null,
    generated_at: '2026-11-23T00:00:00Z'
};

function mockUser(value: object) {
    jest.spyOn(UC, 'default').mockReturnValue(value as ReturnType<typeof UC.default>);
}

const loggedIn = {userLoaded: true, isLoggedIn: true, uuid: 'uuid-1'};

function respondWith(body: unknown) {
    mockFetch.mockResolvedValue({ok: true, json: () => Promise.resolve(body)});
}

function Probe({label = 'probe'}: {label?: string}) {
    const {status, data, has} = usePersonalization();

    return (
        <div data-testid={label}>
            {status}|{data?.audience ?? 'none'}|{data?.first_name ?? 'noname'}|
            {String(has('role:instructor'))}|{String(has('role:student'))}
        </div>
    );
}

function renderProbe(children = <Probe />) {
    return render(<PersonalizationContextProvider>{children}</PersonalizationContextProvider>);
}

describe('personalization context', () => {
    beforeEach(() => {
        mockFetch.mockReset();
        clearPersonalizationCache();
        sessionStorage.clear();
        jest.restoreAllMocks();
        jest.spyOn(console, 'warn').mockImplementation(() => null);
    });

    it('stays loading until the user model is known', () => {
        mockUser({userLoaded: false, isLoggedIn: false});
        renderProbe();
        expect(screen.getByTestId('probe').textContent).toMatch(/^loading\|none/);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('treats anonymous visitors as anonymous without a request', () => {
        mockUser({userLoaded: true, isLoggedIn: false});
        renderProbe();
        expect(screen.getByTestId('probe').textContent).toMatch(/^anonymous\|none/);
        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('is ready with fetched data for a logged-in visitor, sending credentials', async () => {
        mockUser(loggedIn);
        respondWith(payload);
        renderProbe();
        expect(screen.getByTestId('probe').textContent).toMatch(/^loading/);
        await screen.findByText('ready|instructor|Roy|true|false');
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/v1/personalization'),
            expect.objectContaining({credentials: 'include'})
        );
    });

    it('reports an error when the fetch fails', async () => {
        mockUser(loggedIn);
        mockFetch.mockRejectedValue(new Error('down'));
        renderProbe();
        await screen.findByText(/^error\|none/);
    });

    it('reports an error for a null response', async () => {
        mockUser(loggedIn);
        respondWith(null);
        renderProbe();
        await screen.findByText(/^error\|none/);
    });

    it('reports an error for an unknown contract version', async () => {
        mockUser(loggedIn);
        respondWith({...payload, v: 2});
        renderProbe();
        await screen.findByText(/^error\|none/);
    });

    it('stores only uuid, audience, segments, v and savedAt', async () => {
        mockUser(loggedIn);
        respondWith(payload);
        renderProbe();
        await screen.findByText(/^ready/);
        const stored = JSON.parse(sessionStorage.getItem('personalization') as string);

        expect(Object.keys(stored).sort()).toEqual(['audience', 'savedAt', 'segments', 'uuid', 'v']);
        expect(sessionStorage.getItem('personalization')).not.toMatch(/Roy|Rice|Physics/);
    });

    describe('sessionStorage hydration', () => {
        const entry = {
            uuid: 'uuid-1',
            v: 1,
            audience: 'student',
            segments: ['role:student'],
            savedAt: Date.now()
        };

        it('is used while the fresh request is in flight', async () => {
            mockUser(loggedIn);
            sessionStorage.setItem('personalization', JSON.stringify(entry));
            mockFetch.mockReturnValue(new Promise(() => null));
            renderProbe();
            expect(screen.getByTestId('probe').textContent).toBe('ready|student|noname|false|true');
        });

        it('is replaced by the fresh response', async () => {
            mockUser(loggedIn);
            sessionStorage.setItem('personalization', JSON.stringify(entry));
            respondWith(payload);
            renderProbe();
            await screen.findByText('ready|instructor|Roy|true|false');
        });

        it('is ignored when the uuid differs', () => {
            mockUser(loggedIn);
            sessionStorage.setItem('personalization', JSON.stringify({...entry, uuid: 'other'}));
            mockFetch.mockReturnValue(new Promise(() => null));
            renderProbe();
            expect(screen.getByTestId('probe').textContent).toMatch(/^loading/);
        });

        it('is ignored once past the 10 minute TTL', () => {
            mockUser(loggedIn);
            sessionStorage.setItem(
                'personalization',
                JSON.stringify({...entry, savedAt: Date.now() - 11 * 60 * 1000})
            );
            mockFetch.mockReturnValue(new Promise(() => null));
            renderProbe();
            expect(screen.getByTestId('probe').textContent).toMatch(/^loading/);
        });
    });

    it('survives storage throwing', async () => {
        mockUser(loggedIn);
        respondWith(payload);
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('denied');
        });
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('denied');
        });
        renderProbe();
        await screen.findByText('ready|instructor|Roy|true|false');
    });

    it('makes one request for two consumers', async () => {
        mockUser(loggedIn);
        respondWith(payload);
        renderProbe(
            <>
                <Probe label="a" />
                <Probe label="b" />
            </>
        );
        await screen.findAllByText('ready|instructor|Roy|true|false');
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('refetches for a different uuid', async () => {
        mockUser(loggedIn);
        respondWith(payload);
        const view = renderProbe();

        await screen.findByText(/^ready/);
        mockUser({...loggedIn, uuid: 'uuid-2'});
        view.rerender(
            <PersonalizationContextProvider>
                <Probe />
            </PersonalizationContextProvider>
        );
        await screen.findByText(/^ready/);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });
});
