import React, {useEffect} from 'react';
const d = document;

/* eslint camelcase: 0 */
function disqus_config() {
    this.page.url = window.location.href;
    this.page.identifier = window.location.pathname;
}

function loadDisqus() {
    const s = d.createElement('script');

    s.src = '//openstax.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);

    const s2 = d.createElement('script');

    s2.src = '//openstax.disqus.com/count.js';
    s2.setAttribute('date-timestamp', +new Date());
    d.body.appendChild(s2);
}

function reloadDisqus() {
    DISQUS.reset({
        reload: true,
        config: disqus_config
    });
}

export default function DisqusForm() {
    useEffect(() => {
        const disqusScript = d.querySelector('script[src*="openstax.disqus.com"]');

        if (disqusScript) {
            reloadDisqus();
        } else {
            loadDisqus();
        }
    });

    return (
        <div id="disqus_thread" class="disqus" />
    );
}
