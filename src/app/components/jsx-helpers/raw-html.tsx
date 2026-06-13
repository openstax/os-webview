import React from 'react';
import cn from 'classnames';
import usePortalContext from '~/contexts/portal';
import './raw-html.scss';

// Making scripts work, per https://stackoverflow.com/a/47614491/392102
function activateScripts(el: HTMLElement) {
    const scripts: HTMLScriptElement[] = Array.from(
        el.querySelectorAll('script')
    );
    const processOne = () => {
        const s = scripts.shift();

        if (!s) {
            return;
        }
        const newScript = document.createElement('script');
        const p = s.src
            ? new Promise((resolve) => {
                  newScript.onload = resolve;
              })
            : Promise.resolve();

        Array.from(s.attributes).forEach((a) =>
            newScript.setAttribute(a.name, a.value)
        );
        if (s.textContent) {
            newScript.appendChild(document.createTextNode(s.textContent));
        }
        newScript.async = false;
        s.parentNode?.replaceChild(newScript, s);

        p.then(processOne);
    };

    processOne();
}

type RawHTMLArgs = ({
    Tag?: string;
    html?: string;
    embed?: boolean;
    href?: string;
} & React.HTMLAttributes<HTMLDivElement>);

export default function RawHTML({
    Tag = 'div',
    html = '',
    embed = false,
    className,
    ...otherProps
}: RawHTMLArgs) {
    const ref = React.useRef<HTMLElement>();
    const {rewriteLinks} = usePortalContext();

    React.useEffect(() => {
        if (embed && ref.current) {
            activateScripts(ref.current);
        }
    });
    React.useLayoutEffect(() => rewriteLinks?.(ref.current as HTMLElement), [rewriteLinks]);

    return React.createElement(Tag, {
        ref,
        dangerouslySetInnerHTML: {__html: html},
        ...otherProps,
        // Tag all CMS-authored markup with `cms-content` so styles for editor
        // content (e.g. buttons) can target it specifically.
        className: cn('cms-content', className)
    });
}
