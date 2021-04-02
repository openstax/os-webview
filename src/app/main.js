import $ from './helpers/$';
import ReactDOM from 'react-dom';
import appElement from '~/components/shell/shell';
import './sentry';

if (!$.isSupported()) {
    /* eslint no-alert: 0 */
    alert('Our site is designed to work with recent versions of Chrome,' +
    ' Firefox, Edge and Safari. It may not work in your browser.');
}

ReactDOM.render(appElement, document.getElementById('app'));
