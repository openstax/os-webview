import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    jest
} from '@jest/globals';
import activateScripts, {
    isEmbedScriptUrl
} from '~/components/jsx-helpers/activate-scripts';

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

    it('leaves a repeated module script unwrapped', async () => {
        const source = 'export const x = 1; window.ran.push("module");';

        activateScripts(container(`<script type="module">${source}</script>`));
        activateScripts(container(`<script type="module">${source}</script>`));
        await flush();

        const texts = Array.from(document.querySelectorAll('script')).map(
            (s) => s.textContent
        );

        expect(texts).toEqual([source, source]);
    });

    it('leaves a repeated JSON data block unchanged', async () => {
        const json = '{"@context": "https://schema.org"}';

        activateScripts(
            container(`<script type="application/ld+json">${json}</script>`)
        );
        activateScripts(
            container(`<script type="application/ld+json">${json}</script>`)
        );
        await flush();

        const texts = Array.from(document.querySelectorAll('script')).map(
            (s) => s.textContent
        );

        expect(texts).toEqual([json, json]);
    });

    it('keeps going when a detached script has a src', async () => {
        const el = container(
            '<script src="/first.js"></script><script src="/gone.js"></script><script>window.ran.push("after")</script>'
        );

        activateScripts(el);
        await flush();
        scriptsIn(el)[1].remove();
        scriptsIn(el)[0].dispatchEvent(new Event('load'));
        await flush();

        expect(recorder().ran).toEqual(['after']);
    });
});

describe('activate-scripts from blob URLs', () => {
    const original = {
        create: URL.createObjectURL,
        revoke: URL.revokeObjectURL
    };
    let blobs: Blob[];

    const readBlob = (blob: Blob) =>
        new Promise<string>((resolve) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result as string);
            reader.readAsText(blob);
        });

    beforeEach(() => {
        document.body.innerHTML = '';
        recorder().ran = [];
        blobs = [];
        URL.createObjectURL = jest.fn((blob: Blob | MediaSource) => {
            blobs.push(blob as Blob);

            return `blob:https://dev.openstax.org/${blobs.length}-${Math.random()}`;
        });
        URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
        URL.createObjectURL = original.create;
        URL.revokeObjectURL = original.revoke;
    });

    it('loads an inline classic script from a blob and records the URL', async () => {
        const el = container('<script>window.ran.push("first blob")</script>');

        activateScripts(el);
        await flush();

        const [script] = scriptsIn(el);

        expect(script.src).toMatch(/^blob:https:\/\/dev\.openstax\.org\//);
        expect(script.textContent).toBe('');
        expect(isEmbedScriptUrl(script.src)).toBe(true);
        expect(isEmbedScriptUrl('https://openstax.org/')).toBe(false);
        expect(script.getAttribute('data-activated')).toBe('true');
        expect(await readBlob(blobs[0])).toBe('window.ran.push("first blob")');
        expect(blobs[0].type).toBe('text/javascript');
    });

    it('waits for each blob script to load before the next', async () => {
        const el = container(
            '<script>window.ran.push("a")</script><script>window.ran.push("b")</script>'
        );

        activateScripts(el);
        await flush();
        expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
        expect(scriptsIn(el)[1].getAttribute('data-activated')).toBeNull();

        scriptsIn(el)[0].dispatchEvent(new Event('load'));
        await flush();

        expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
        expect(scriptsIn(el)[1].src).toMatch(/^blob:/);
    });

    it('revokes the blob URL on load but keeps it recorded', async () => {
        const el = container('<script>window.ran.push("a")</script>');

        activateScripts(el);
        await flush();

        const {src} = scriptsIn(el)[0];

        expect(URL.revokeObjectURL).not.toHaveBeenCalled();
        scriptsIn(el)[0].dispatchEvent(new Event('load'));
        await flush();

        expect(URL.revokeObjectURL).toHaveBeenCalledWith(src);
        expect(isEmbedScriptUrl(src)).toBe(true);
    });

    it('revokes and carries on when a blob script errors', async () => {
        const el = container(
            '<script>window.ran.push("a")</script><script src="/x.js"></script>'
        );

        activateScripts(el);
        await flush();
        scriptsIn(el)[0].dispatchEvent(new Event('error'));
        await flush();

        expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
        expect(scriptsIn(el)[1].getAttribute('data-activated')).toBe('true');
    });

    it('wraps the blob source of a repeated snippet', async () => {
        const source = 'const repeated = 1; window.ran.push(repeated)';

        activateScripts(container(`<script>${source}</script>`));
        activateScripts(container(`<script>${source}</script>`));
        await flush();

        expect(await readBlob(blobs[0])).toBe(source);
        expect(await readBlob(blobs[1])).toBe(
            `(function () {\n${source}\n})();`
        );
    });

    it('leaves module, JSON and external scripts out of the blob path', async () => {
        const el = container(
            '<script type="module">export const x = 1;</script>' +
                '<script type="application/ld+json">{"a": 1}</script>'
        );

        activateScripts(el);
        await flush();

        expect(URL.createObjectURL).not.toHaveBeenCalled();
        expect(scriptsIn(el).map((s) => s.textContent)).toEqual([
            'export const x = 1;',
            '{"a": 1}'
        ]);

        const ext = container('<script src="/external.js"></script>');

        activateScripts(ext);
        await flush();
        scriptsIn(ext)[0].dispatchEvent(new Event('load'));
        await flush();

        expect(URL.createObjectURL).not.toHaveBeenCalled();
        expect(URL.revokeObjectURL).not.toHaveBeenCalled();
        expect(scriptsIn(ext)[0].getAttribute('src')).toBe('/external.js');
    });

    it('falls back to a text node when createObjectURL is unavailable', async () => {
        // @ts-expect-error simulating an environment without the API
        delete URL.createObjectURL;
        const el = container('<script>window.ran.push("text")</script>');

        activateScripts(el);
        await flush();

        expect(scriptsIn(el)[0].src).toBe('');
        expect(scriptsIn(el)[0].textContent).toBe('window.ran.push("text")');
        expect(recorder().ran).toEqual(['text']);
    });
});
