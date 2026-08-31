import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import SchoolSelector from '~/components/school-selector/school-selector';
import {LanguageContextProvider} from '~/contexts/language';
import * as UMS from '~/models/use-school-suggestion-list';

jest.mock('~/helpers/main-class-hooks', () => ({
    useMainSticky: () => jest.fn()
}));

describe('school-selector', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });
    it('restores focus to the active element when school info appears', () => {
        jest.useFakeTimers();
        jest.spyOn(document, 'hasFocus').mockReturnValue(true);
        jest.spyOn(UMS, 'default').mockReturnValue({
            schoolNames: [],
            schoolIsOk: false,
            selectedSchool: null
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(
            <LanguageContextProvider>
                <SchoolSelector initialValue="Rice University" />
            </LanguageContextProvider>
        );

        const active = document.activeElement as HTMLElement;
        const focusSpy = jest.spyOn(active, 'focus');

        jest.advanceTimersByTime(40);
        expect(focusSpy).toHaveBeenCalled();
    });
    it('sets a hidden field when there is a selected school', async () => {
        jest.spyOn(UMS, 'default').mockReturnValue({
            schoolNames: ['one'],
            schoolIsOk: true,
            selectedSchool: {
                location: 'loc',
                // eslint-disable-next-line camelcase
                total_school_enrollment: null,
                type: 'college'
            }
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(
            <LanguageContextProvider>
                <SchoolSelector />
            </LanguageContextProvider>
        );

        const selector = '[name="school_type"]';

        await waitFor(() => expect(document.querySelector<HTMLInputElement>(selector)).toBeTruthy());
        const schoolType = document.querySelector<HTMLInputElement>(selector);

        expect(schoolType?.value).toBe('college');
    });
});
