import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import RawHTML from '~/components/jsx-helpers/raw-html';

describe('raw-html', () => {
    it('activates scripts', async () => {
        const html1 = '<script>const a = 1;</script>';
        const html2 = '<script src="something" />';
        const html3 = '<div><b>hi</b></div>';

        render(
            <div>
                <RawHTML html={html1} embed />
                <RawHTML html={html2} embed />
                <RawHTML html={html3} />
            </div>
        );

        await screen.findByText('hi');
    });
});
