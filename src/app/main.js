import $ from './helpers/$';
import appElement from '/src/app/components/shell/shell';
import ReactDOM from 'react-dom';
import './sentry';
import '../styles/main.scss';

if (window.SETTINGS.analyticsID.endsWith('3')) {
    import('preact/debug');
}

if (!$.isSupported()) {
    /* eslint no-alert: 0 */
    window.alert('Our site is designed to work with recent versions of Chrome,' +
    ' Firefox, Edge and Safari. It may not work in your browser.');
}

ReactDOM.render(appElement, document.getElementById('app'));
