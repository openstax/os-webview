import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import WebinarGridSection from '~/pages/webinars/webinar-cards/webinar-grid-section';
import { upcomingWebinar, pastWebinar } from '../../data/webinars';

const webinars = [upcomingWebinar, pastWebinar];
const heading = 'WebSection Heading';

describe('webinar grid', () => {
    it('displays all webinars', () => {
        render(<WebinarGridSection webinars={webinars} heading={heading} />);
        expect(screen.queryAllByRole('link')).toHaveLength(2);
        expect(screen.queryAllByText(heading)).toHaveLength(1);
    });
    it('distinguishes upcoming from past', () => {
        const {container} = render(<WebinarGridSection webinars={webinars} heading={heading} />);

        expect(container.querySelectorAll('.upcoming')).toHaveLength(1);
    });
    it('noops if webinar list is empty', () => {
        render(<WebinarGridSection webinars={[]} heading={heading} />);
        expect(screen.queryAllByText(heading)).toHaveLength(0);
    });
});

