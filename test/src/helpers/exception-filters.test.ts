import {isIgnoredMessage, isFromDeniedScheme} from '~/helpers/exception-filters';

describe('exception-filters', () => {
    it('ignores a message on the shared noise list', () => {
        expect(isIgnoredMessage('Object Not Found Matching Id:4')).toBe(true);
    });

    it('keeps a message that is not noise', () => {
        expect(
            isIgnoredMessage('Failed to fetch sticky/: Error: Maximum retries exceeded')
        ).toBe(false);
    });

    it('drops a stack that is entirely masked extension frames', () => {
        expect(
            isFromDeniedScheme([
                'webkit-masked-url://hidden/',
                'webkit-masked-url://hidden/'
            ])
        ).toBe(true);
        expect(isFromDeniedScheme(['chrome-extension://abc/content.js'])).toBe(true);
    });

    it('keeps a stack that only passes through an extension', () => {
        expect(
            isFromDeniedScheme([
                'moz-extension://abc/inject.js',
                'https://openstax.org/dist/main.js'
            ])
        ).toBe(false);
    });

    it('keeps an exception that reported no frames at all', () => {
        expect(isFromDeniedScheme([])).toBe(false);
    });
});
