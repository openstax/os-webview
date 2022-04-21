// Expect required variables to be set in settings.js
(function () {
    function async_load() {
        const s = document.createElement('script');

        s.type = 'text/javascript';
        s.src = `${'https:' == document.location.protocol ? 'https://pi' : 'http://cdn'}.pardot.com/pd.js`;
        const c = document.getElementsByTagName('script')[0];

        c.parentNode.insertBefore(s, c);
    }
    if (window.attachEvent) {window.attachEvent('onload', async_load);} else {window.addEventListener('load', async_load, false);}
})();
