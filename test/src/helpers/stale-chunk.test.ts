import recoverFromStaleChunk, {
    handleScriptError,
    listenForStaleChunks
} from '~/helpers/stale-chunk';

const RELOAD_KEY = 'osweb-stale-chunk-reloads';

function chunkError() {
    const error = new Error('Loading chunk 47 failed.');

    error.name = 'ChunkLoadError';

    return error;
}

function mockStorage(store: Record<string, string>, overrides = {}) {
    Reflect.defineProperty(window, 'sessionStorage', {
        writable: true,
        value: {
            getItem: (k: string) => store[k] ?? null,
            setItem: (k: string, v: string) => {
                store[k] = v;
            },
            ...overrides
        }
    });
}

describe('stale-chunk', () => {
    let reload: jest.Mock;

    beforeEach(() => {
        reload = jest.fn();
        Reflect.defineProperty(window, 'location', {
            writable: true,
            value: {origin: 'https://openstax.org', reload}
        });
        mockStorage({});
    });

    describe('recoverFromStaleChunk', () => {
        it('reloads on a ChunkLoadError', () => {
            expect(recoverFromStaleChunk(chunkError())).toBe(true);
            expect(reload).toHaveBeenCalled();
        });
        it('reloads on the message alone, without the error name', () => {
            expect(
                recoverFromStaleChunk(new Error('Loading chunk 3 failed.'))
            ).toBe(true);
        });
        it('ignores an unrelated error', () => {
            expect(recoverFromStaleChunk(new TypeError('nope'))).toBe(false);
            expect(reload).not.toHaveBeenCalled();
        });
        it('ignores a thrown non-error', () => {
            expect(recoverFromStaleChunk(null)).toBe(false);
        });
        it('ignores an error with no message', () => {
            expect(recoverFromStaleChunk({})).toBe(false);
        });
        it('gives up once the reload budget is spent', () => {
            mockStorage({[RELOAD_KEY]: '2'});
            expect(recoverFromStaleChunk(chunkError())).toBe(false);
            expect(reload).not.toHaveBeenCalled();
        });
        it('counts each reload', () => {
            const store = {};

            mockStorage(store);
            recoverFromStaleChunk(chunkError());
            expect(store).toEqual({[RELOAD_KEY]: '1'});
        });
        it('declines to reload when storage cannot be read', () => {
            mockStorage({}, {
                getItem: () => {
                    throw new Error('denied');
                }
            });
            expect(recoverFromStaleChunk(chunkError())).toBe(false);
            expect(reload).not.toHaveBeenCalled();
        });
        it('declines to reload when the counter cannot be written', () => {
            mockStorage({}, {
                setItem: () => {
                    throw new Error('quota');
                }
            });
            expect(recoverFromStaleChunk(chunkError())).toBe(false);
            expect(reload).not.toHaveBeenCalled();
        });
    });

    describe('handleScriptError', () => {
        function errorEvent(error: Error, filename: string) {
            return {error, filename} as ErrorEvent;
        }

        it('reloads when one of our chunks parses as markup', () => {
            handleScriptError(
                errorEvent(
                    new SyntaxError("Unexpected token '<'"),
                    'https://openstax.org/dist/chunk-abc.js'
                )
            );
            expect(reload).toHaveBeenCalled();
        });
        it('ignores a script outside dist', () => {
            handleScriptError(
                errorEvent(
                    new SyntaxError("Unexpected token '<'"),
                    'https://openstax.org/other/thing.js'
                )
            );
            expect(reload).not.toHaveBeenCalled();
        });
        it('ignores a third-party script', () => {
            handleScriptError(
                errorEvent(
                    new SyntaxError("Unexpected token '<'"),
                    'https://js.pulseinsights.com/dist/survey.js'
                )
            );
            expect(reload).not.toHaveBeenCalled();
        });
        it('ignores an unparseable filename', () => {
            handleScriptError(
                errorEvent(new SyntaxError("Unexpected token '<'"), 'not a url')
            );
            expect(reload).not.toHaveBeenCalled();
        });
        it('ignores errors that are not syntax errors', () => {
            handleScriptError(
                errorEvent(
                    new TypeError('nope'),
                    'https://openstax.org/dist/chunk-abc.js'
                )
            );
            expect(reload).not.toHaveBeenCalled();
        });
    });

    describe('listenForStaleChunks', () => {
        it('recovers from a rejected chunk import', () => {
            listenForStaleChunks();
            window.dispatchEvent(
                Object.assign(new Event('unhandledrejection'), {
                    reason: chunkError()
                })
            );
            expect(reload).toHaveBeenCalled();
        });
        it('recovers from a chunk that parses as markup', () => {
            listenForStaleChunks();
            window.dispatchEvent(
                Object.assign(new Event('error'), {
                    error: new SyntaxError("Unexpected token '<'"),
                    filename: 'https://openstax.org/dist/chunk-abc.js'
                })
            );
            expect(reload).toHaveBeenCalled();
        });
    });
});
