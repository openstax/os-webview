import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import Webinars from '~/pages/subjects/new/specific/webinars';
import useSpecificSubjectContext from '~/pages/subjects/new/specific/context';
import {webinarHeader, webinarItems} from '../../data/specific-subject';
import {useDataFromSlug} from '~/helpers/page-data-utils';

function Component() {
    return (
        <ShellContextProvider>
            <Webinars />
        </ShellContextProvider>
    );
}

jest.mock('~/pages/subjects/new/specific/context', () => jest.fn());
jest.mock('~/helpers/page-data-utils', () => ({
    ...jest.requireActual('~/helpers/page-data-utils'),
    useDataFromSlug: jest.fn()
}));
// react-aria-carousel does not play nice with Jest
jest.mock('react-aria-carousel', () => ({
    Carousel: jest.fn()
}));
Element.prototype.scrollTo = jest.fn();

describe('new subjects webinars page', () => {
    it('renders nothing when it has not context', () => {
        render(<Component />);
        expect(screen.queryAllByText('No webinars found (yet)')).toHaveLength(
            0
        );
    });
    it('renders something when it has context but no webinars', () => {
        (useSpecificSubjectContext as jest.Mock).mockReturnValue({
            webinarHeader
        });
        render(<Component />);
        expect(screen.queryAllByText('No webinars found (yet)')).toHaveLength(
            1
        );
        expect(
            screen.queryAllByText(webinarHeader.content.heading)
        ).toHaveLength(0);
    });
    it('renders webinars (and finds English translation)', () => {
        (useSpecificSubjectContext as jest.Mock).mockReturnValue({
            webinarHeader,
            translations: [[{locale: 'en', slug: 'math-books'}]]
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(webinarItems);
        render(<Component />);
        expect(screen.queryAllByText('No webinars found (yet)')).toHaveLength(
            0
        );
    });
    it('renders webinars (and finds no English translation)', () => {
        (useSpecificSubjectContext as jest.Mock).mockReturnValue({
            webinarHeader,
            translations: [[{locale: 'es', slug: 'math-books'}]]
        });
        (useDataFromSlug as jest.Mock).mockReturnValue(webinarItems);
        render(<Component />);
        expect(screen.queryAllByText('No webinars found (yet)')).toHaveLength(
            0
        );
    });
});
