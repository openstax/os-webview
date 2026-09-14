import React from 'react';
import {describe, it, expect, beforeEach} from '@jest/globals';
import {render, screen, cleanup} from '@testing-library/preact';
import RawHTML from '~/components/jsx-helpers/raw-html';

type Recorder = {ran: unknown[]};

const recorder = () => window as unknown as Recorder;

describe('raw-html', () => {
    beforeEach(() => {
        recorder().ran = [];
    });

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

    it('runs an embedded script once across re-renders', () => {
        const html = '<script>window.ran.push("rendered")</script>';
        const {rerender} = render(<RawHTML html={html} embed />);

        rerender(<RawHTML html={html} embed />);
        rerender(<RawHTML html={html} embed className="now-with-a-class" />);

        expect(recorder().ran).toEqual(['rendered']);
    });

    it('survives remounting a script that declares a top-level const', () => {
        // The OSWEB-9PN case: navigating away from a page whose CMS block
        // embeds this and back again gets a new element, but the same window.
        const html = '<script>const rawHtmlUrls = ["u"]; window.ran.push(rawHtmlUrls[0])</script>';

        render(<RawHTML html={html} embed />);
        cleanup();
        render(<RawHTML html={html} embed />);

        expect(recorder().ran).toEqual(['u', 'u']);
    });

    it('leaves scripts inert without embed', () => {
        render(<RawHTML html={'<script>window.ran.push("nope")</script>'} />);

        expect(recorder().ran).toEqual([]);
    });
});
