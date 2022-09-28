import React from 'react';

// Making scripts work, per https://stackoverflow.com/a/47614491/392102
function activateScripts(el) {
    const scripts = Array.from(el.querySelectorAll('script'));
    const processOne = (() => {
        if (scripts.length === 0) {
            return;
        }
        const s = scripts.shift();
        const newScript = document.createElement('script');
        const p = (s.src) ? new Promise((resolve) => {
            newScript.onload = resolve;
        }) : Promise.resolve();

        Array.from(s.attributes)
            .forEach((a) => newScript.setAttribute(a.name, a.value));
        newScript.appendChild(document.createTextNode(s.textContent));
        newScript.async = false;
        s.parentNode?.replaceChild(newScript, s);

        p.then(processOne);
    });

    processOne();
}

export default function RawHTML({Tag='div', html, embed=false, ...otherProps}) {
    const ref = React.useRef();

    React.useEffect(() => {
        if (embed) {
            activateScripts(ref.current);
        }
    });
    return (
        <Tag dangerouslySetInnerHTML={{__html: html}} {...otherProps} ref={ref} />
    );
}
