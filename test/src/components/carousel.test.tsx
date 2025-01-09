import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import Carousel, { FrameChanger } from '~/components/carousel/carousel';

const mockReactCarousel = jest.fn();
const mockCarouselButton = jest.fn();

// react-aria-carousel does not play nice with Jest
jest.mock('react-aria-carousel', () => ({
    Carousel: ({children}: React.PropsWithChildren<object>) => mockReactCarousel({children}),
    CarouselButton: ({children}: React.PropsWithChildren<object>) => mockCarouselButton({children})
}));

describe('carousel', () => {
    mockReactCarousel.mockImplementation(({children}: React.PropsWithChildren<object>) => {
        return <div>{children}</div>;
    });
    mockCarouselButton.mockImplementation(({children}: React.PropsWithChildren<object>) => {
        return <div>{children}</div>;
    });
    it('renders with hover text', () => {
        render(
            <Carousel hoverTextThing='some hover text' atATime={2}>
                <div>one</div>
                <div>two</div>
                <div>three</div>
                <div>four</div>
            </Carousel>
        );
        expect(document.querySelectorAll('.hover-text')).toHaveLength(2);
    });
    it('renders with empty hover text, default atATime', () => {
        render(
            <Carousel hoverTextThing=''>
                <div>one</div>
                <div>two</div>
                <div>three</div>
                <div>four</div>
            </Carousel>
        );
        expect(document.querySelectorAll('.hover-text')).toHaveLength(0);
    });
});

describe('frame-changer', () => {
    const user = userEvent.setup();

    it('renders disabled', async () => {
        const onclick = jest.fn();

        render(<FrameChanger chevronDirection='left' onClick={onclick} disable />);
        const b = screen.getByRole('button');

        expect(b.getAttribute('disabled')).toBe('');
        await user.click(b);
        expect(onclick).not.toHaveBeenCalled();
    });
    it('handles clicks when not disabled', async () => {
        const onclick = jest.fn();

        render(<FrameChanger chevronDirection='left' onClick={onclick} hoverText='some hover text' />);
        const b = screen.getByRole('button');

        expect(b.getAttribute('disabled')).not.toBe(true);
        await user.click(b);
        expect(onclick).toHaveBeenCalled();
        expect(b.querySelector('.hover-text')?.textContent).toBe('some hover text');
    });
});
