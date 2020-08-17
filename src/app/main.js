import $ from './helpers/$';
import router from './router';

router.start();

if (!$.isSupported()) {
    /* eslint no-alert: 0 */
    alert('Our site is designed to work with recent versions of Chrome,' +
    ' Firefox, Edge and Safari. It may not work in your browser.');
}
