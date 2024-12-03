import React from 'react';

// Making scripts work, per https://stackoverflow.com/a/47614491/392102
function activateScripts(el: HTMLElement) {
    const scripts: HTMLScriptElement[] = Array.from(el.querySelectorAll('script'));
    const processOne = (() => {
        const s = scripts.shift();

        if (!s) {
            return;
        }
        const newScript = document.createElement('script');
        const p = (s.src) ? new Promise((resolve) => {
            newScript.onload = resolve;
        }) : Promise.resolve();

        Array.from(s.attributes)
            .forEach((a) => newScript.setAttribute(a.name, a.value));
        if (s.textContent) {
            newScript.appendChild(document.createTextNode(s.textContent));
        }
        newScript.async = false;
        s.parentNode?.replaceChild(newScript, s);

        p.then(processOne);
    });

    processOne();
}

type RawHTMLArgs = {Tag?: string, html?: TrustedHTML, embed?: boolean} & React.HTMLAttributes<HTMLDivElement>;

export default function RawHTML({Tag='div', html, embed=false, ...otherProps}: RawHTMLArgs) {
    const ref = React.useRef<HTMLElement>();

    React.useEffect(() => {
        if (embed && ref.current) {
            activateScripts(ref.current);
        }
    });
    return (
        React.createElement(Tag, {ref, dangerouslySetInnerHTML: {__html: html}, ...otherProps})
    );
}
