import React from 'react';
import {render, screen} from '@testing-library/preact';
import ClippedImage from '~/components/clipped-image/clipped-image';

describe('ClippedImage', () => {
    it('titles the image when alt text is given', () => {
        render(<ClippedImage src="pic.png" alt="a description" />);
        expect(screen.getByTitle('a description')).toBeTruthy();
    });

    it('hides it from assistive tech when alt text is absent', () => {
        const {container} = render(<ClippedImage src="pic.png" />);

        expect(container.querySelector('[aria-hidden]')).toBeTruthy();
    });
});
