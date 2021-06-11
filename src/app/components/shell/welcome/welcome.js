import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import cookie from '~/helpers/cookie';
import sfApiFetch from '~/pages/my-openstax/store/sfapi';
import $ from '~/helpers/$';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import routerBus from '~/helpers/router-bus';
import './welcome.scss';

/*
    There should be two values in the cookie
    1. Has the user been welcomed?
    2. Is the user a new account?
    If already welcomed, done.
    If the user is a new account, show the welcome message for new
      student or educator account
    If an existing account and an educator, show a message for that
    Educators navigate to my-openstax (as their homepage?)
    Students can be navigated to subjects
*/

// FOR TESTING -- these lines reset the welcome and walkthrough cookies
if ((/dev|local/).test(window.location.hostname)) {
    console.info('Resetting welcome and walkthrough cookies'); // Leave this
    cookie.deleteKey('hasBeenWelcomed');
    cookie.deleteKey('walkthroughDone');
}

function useSFUser() {
    const [data, setData] = React.useState();

    React.useEffect(() => {
        sfApiFetch('users').then((d) => setData($.camelCaseKeys(d)));
    }, []);

    return data;
}


function WalkthroughButtons({welcomeDone}) {
    function goToMyOpenStax() {
        welcomeDone();
        window.setTimeout(() => {
            routerBus.emit('navigate', '/my-openstax');
        }, 100);
    }

    function skipWalkthrough() {
        cookie.setKey('walkthroughDone');
        goToMyOpenStax();
    }

    return (
        <div className="button-row">
            <button onClick={skipWalkthrough}>Skip walkthrough</button>
            <button className="primary" onClick={goToMyOpenStax}>Show me around</button>
        </div>
    );
}

function CloseButton({welcomeDone}) {
    return (
        <div className="button-row">
            <button className="primary" onClick={welcomeDone}>Close</button>
        </div>
    );
}

const HOUR_IN_MS = 3600000;

function dialogData(isNew, isFaculty, firstName) {
    if (isNew) {
        return isFaculty ?
            {
                title: `Welcome to OpenStax, ${firstName}!`,
                body: `<p>Your books, additional resources, and profile information are
                saved here.</p>
                <p>To get a quick walkthrough of My OpenStax, click “Show me around” –
                or skip the tour and explore on your own.</p>`,
                walkthrough: true
            } :
            {
                title: `Thanks, ${firstName}!`,
                body: `You’re just clicks away from accessing free textbooks and
                resources. Take full advantage of your OpenStax account by using
                features like highlighting and notetaking in our digital reading
                experience.`,
                walkthrough: false
            };
    }
    return isFaculty ?
        {
            title: `Welcome back, ${firstName}!`,
            body: `<p>Your account has been upgraded to <b>My OpenStax</b>, a new, personalized
            dashboard to help you navigate our website.</p>
            <p>Take a quick walkthrough of My OpenStax, or skip this and explore on your own.</p>`,
            walkthrough: true
        } : null;
}

function CustomDialog({data, welcomeDone}) {
    const [Dialog] = useDialog(true);

    return (
        <Dialog className="welcome-dialog" title={data.title} afterClose={welcomeDone}>
            <RawHTML html={data.body} />
            {data.walkthrough ?
                <WalkthroughButtons welcomeDone={welcomeDone} /> :
                <CloseButton welcomeDone={welcomeDone} />}
        </Dialog>
    );
}

export default function Welcome() {
    const userModel = useSFUser();
    const [showWelcome, welcomeDone] = React.useReducer(
        () => cookie.setKey('hasBeenWelcomed'),
        !cookie.hash.hasBeenWelcomed
    );

    if (!showWelcome || !userModel || userModel.error) {
        return null;
    }

    const {createdAt, firstName, role} = userModel.lead[0];
    const elapsedHours = (Date.now() - new Date(createdAt)) / HOUR_IN_MS;
    const isNew = elapsedHours < 1000; // *** CHANGE THIS TO LIKE 24
    const isFaculty = role === 'Faculty';
    const data = dialogData(isNew, isFaculty, firstName);

    return (
        <CustomDialog data={data} welcomeDone={welcomeDone} />
    );
}
