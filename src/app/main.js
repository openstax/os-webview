import cmsFetch from '~/helpers/cms-fetch';
import setPreviewPage from './preview-page';

setPreviewPage();
window.exit();

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

    import('./sentry');
    await Promise.all([
        import('../vendor/pardot'),
        import('../vendor/pulseinsights'),
        import('../vendor/facebook')
    ]);

    const isSupported = (await import('./helpers/device')).default;
    const appElement = (await import('/src/app/components/shell/shell'))
        .default;
    const ReactDOM = (await import('react-dom')).default;

    await import('../styles/main.scss');

    if (['3', '4'].includes(window.SETTINGS.analyticsID.substr(-1))) {
        import('preact/debug');
    }

    if (!isSupported()) {
        /* eslint no-alert: 0 */
        window.alert(
            'Our site is designed to work with recent versions of Chrome,' +
                ' Firefox, Edge and Safari. It may not work in your browser.'
        );
    }

    ReactDOM.render(appElement, document.getElementById('app'));
})();
