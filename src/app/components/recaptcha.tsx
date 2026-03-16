import React from 'react';

const TOKEN_RESET_INTERVAL = 100000; // Expires in 2 min, need a little time to process

export default function useRecaptchaToken() {
    const [token, setToken] = React.useState<string>();
    const [fetching, setFetching] = React.useState(false);
    const timeoutRef = React.useRef<number>();

    const [error, setError] = React.useState<string | undefined>();
    const fetchToken = React.useCallback(() => {
        // Reset any previous error before attempting again
        setError(undefined);

        // Ensure grecaptcha is available before calling it
        if (typeof grecaptcha?.ready !== 'function') {
            setError('reCAPTCHA could not be loaded. Please check your connection or try again later.');
            return;
        }

        try {
            setFetching(true);
            grecaptcha.ready(async () => {
                try {
                    const newToken = await grecaptcha.execute(
                        '6LfHkEsrAAAAAHlNvy3EZ_NcCOpvdsHL83NmGDpP',
                        {action: 'submit'});

                    setToken(newToken);
                    // We only set a token when there is no pending timeout, so no worries
                    // about clearing the old one before setting a new one
                    timeoutRef.current = window.setTimeout(() => setToken(undefined), TOKEN_RESET_INTERVAL);
                } catch (err) {
                    console.error('Error executing reCAPTCHA:', err);
                    setError('Unable to verify reCAPTCHA. Please try again later.');
                } finally {
                    setFetching(false);
                }
            });
        } catch (err) {
            console.error('Error initializing reCAPTCHA:', err);
            setError('reCAPTCHA is currently unavailable. Please try again later.');
            setFetching(false);
        }
    }, []);

    React.useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    function Recaptcha({children}: React.PropsWithChildren<object>) {
        if (token) {
            return children;
        }
        if (error) {
            return <div>
                <p>{error}</p>
                <button type="button" disabled={fetching} onClick={fetchToken}>
                    Try again
                </button>
            </div>;
        }
        return <button type="button" disabled={fetching} onClick={fetchToken}>
            I am a human
        </button>;
    }

    return {token, Recaptcha};
}
