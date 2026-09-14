import {describe, it, expect, beforeEach} from '@jest/globals';
import activateScripts from '~/components/jsx-helpers/activate-scripts';

type Recorder = {ran: unknown[]};

const recorder = () => window as unknown as Recorder;

// Lets the promise chain in activateScripts advance.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function container(html: string) {
    const el = document.createElement('div');

    // innerHTML parses scripts but never runs them, which is the situation
    // RawHTML's `embed` mode exists to fix.
    el.innerHTML = html;
    document.body.appendChild(el);

    return el;
}

const scriptsIn = (el: HTMLElement) =>
    Array.from(el.querySelectorAll<HTMLScriptElement>('script'));

describe('activate-scripts', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        recorder().ran = [];
    });

    it('runs inline scripts in document order', async () => {
        const el = container(
            '<script>window.ran.push("a")</script><script>window.ran.push("b")</script>'
        );

        activateScripts(el);
        await flush();

        expect(recorder().ran).toEqual(['a', 'b']);
    });

    it('skips scripts it has already activated', async () => {
        const el = container('<script>window.ran.push("once")</script>');

        activateScripts(el);
        await flush();
        activateScripts(el);
        await flush();

        expect(recorder().ran).toEqual(['once']);
    });

    it('scopes a repeat of the same source so it cannot redeclare', async () => {
        // Top-level const: running this twice unscoped is a SyntaxError that
        // takes out the rest of the walk.
        const source = 'const activatedUrls = {a: 1}; window.ran.push(activatedUrls.a)';

        activateScripts(container(`<script>${source}</script>`));
        await flush();
        activateScripts(container(`<script>${source}</script>`));
        await flush();

        expect(recorder().ran).toEqual([1, 1]);
    });

    it('waits for an external script before running the next one', async () => {
        const el = container(
            '<script src="/external.js"></script><script>window.ran.push("after")</script>'
        );

        activateScripts(el);
        await flush();
        expect(recorder().ran).toEqual([]);

        scriptsIn(el)[0].dispatchEvent(new Event('load'));
        await flush();

        expect(recorder().ran).toEqual(['after']);
    });

    it('carries on when an external script fails to load', async () => {
        const el = container(
            '<script src="/missing.js"></script><script>window.ran.push("after the 404")</script>'
        );

        activateScripts(el);
        await flush();

        scriptsIn(el)[0].dispatchEvent(new Event('error'));
        await flush();

        expect(recorder().ran).toEqual(['after the 404']);
    });

    it('abandons the rest of the walk once cancelled', async () => {
        const el = container(
            '<script src="/external.js"></script><script>window.ran.push("later")</script>'
        );

        const cancel = activateScripts(el);

        await flush();
        cancel();
        scriptsIn(el)[0].dispatchEvent(new Event('load'));
        await flush();

        expect(recorder().ran).toEqual([]);
    });

    it('leaves behind a script that has left the document mid-walk', async () => {
        const el = container(
            '<script src="/external.js"></script><script>window.ran.push("detached")</script>'
        );

        activateScripts(el);
        await flush();
        scriptsIn(el)[1].remove();
        scriptsIn(el)[0].dispatchEvent(new Event('load'));
        await flush();

        expect(recorder().ran).toEqual([]);
    });
});
