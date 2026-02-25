import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import WebinarGridSection from '~/pages/webinars/webinar-cards/webinar-grid-section';
import {upcomingWebinar, pastWebinar} from '../../data/webinars';

const webinars = [upcomingWebinar, pastWebinar];
const heading = 'WebSection Heading';

describe('webinar grid', () => {
    it('displays all webinars', () => {
        render(<WebinarGridSection webinars={webinars} heading={heading} />);
        expect(screen.queryAllByRole('link')).toHaveLength(2);
        expect(screen.queryAllByText(heading)).toHaveLength(1);
    });
    it('distinguishes upcoming from past', () => {
        const {container} = render(
            <WebinarGridSection webinars={webinars} heading={heading} />
        );

        expect(container.querySelectorAll('.upcoming')).toHaveLength(1);
    });
    it('updates CTA to Watch now! for past On24 webinars, regardless of original text', () => {
        const on24Webinar = {
            ...pastWebinar,
            registrationLinkText: 'Sign up here!'
        };
        render(
            <WebinarGridSection webinars={[on24Webinar]} heading={heading} />
        );
        expect(
            screen.queryAllByRole('link', {name: 'Watch now!'})
        ).toHaveLength(1);
    });
    it('does not update CTA to Watch now! for past Zoom webinars', () => {
        const zoomWebinar = {
            ...pastWebinar,
            registrationUrl: 'https://rice.zoom.us/webinar/register/123',
            registrationLinkText: 'Join the meeting'
        };
        render(
            <WebinarGridSection webinars={[zoomWebinar]} heading={heading} />
        );
        expect(
            screen.queryAllByRole('link', {name: 'Join the meeting'})
        ).toHaveLength(1);
    });
});
