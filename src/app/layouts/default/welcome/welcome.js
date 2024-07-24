import React from 'react';
import JITLoad from '~/helpers/jit-load';
import useSharedDataContext from '../../../contexts/shared-data';
// import cookie from '~/helpers/cookie';    // If using the TESTING lines

/*
    There should be two values in the cookie
    1. Has the user been welcomed?
    2. Is the user a new account?
    If already welcomed, done.
    If the user is a new account, show the welcome message for new
      student or educator account
    If an existing account and an educator, show a message for that
    Students can be navigated to subjects
*/

// FOR TESTING -- these lines reset the welcome and walkthrough cookies
// if ((/dev|local/).test(window.location.hostname)) {
//     console.info('Resetting welcome and walkthrough cookies'); // Leave this
//     cookie.deleteKey('hasBeenWelcomed');
//     cookie.deleteKey('walkthroughDone');
// }

export default function WelcomeStoreWrapper() {
    const {flags: {my_openstax: isEnabled}} = useSharedDataContext();

    if (!isEnabled) {
        return null;
    }

    return (
        <JITLoad importFn={() => import('./welcome-content.js')} />
    );
}
