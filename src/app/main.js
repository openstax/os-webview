import './sentry';
import cmsFetch from '~/helpers/cms-fetch';
import {render} from 'preact';

const GLOBAL_SETTINGS = ['piAId', 'piCId', 'piHostname'];

window.SETTINGS = {};

(async () => {
    const settings = (await cmsFetch('webview-settings')).settings;

    for (const {name, value} of settings) {
        if (GLOBAL_SETTINGS.includes(name)) {
            window[name] = value;
        } else {
            window.SETTINGS[name] = value;
        }
    }

    const isSupported = (await import('./helpers/device')).default;
    const appElement = (await import('/src/app/components/shell/shell')).default;

    await import('../styles/main.scss');

    if (['3', '4'].includes(window.SETTINGS.analyticsID?.substr(-1))) {
        import('preact/debug');
    }

    if (!isSupported()) {
        /* eslint no-alert: 0 */
        window.alert('Our site is designed to work with recent versions of Chrome,' +
      ' Firefox, Edge and Safari. It may not work in your browser.');
    }

    render(appElement, document.getElementById('app'));
})();
