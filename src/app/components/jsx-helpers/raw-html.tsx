import React from 'react';
import cn from 'classnames';
import usePortalContext from '~/contexts/portal';
import activateScripts from './activate-scripts';
import './raw-html.scss';

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

    React.useEffect(
        // Only when the markup itself changes; React leaves the DOM (and the
        // already-activated scripts) alone on re-renders with the same html,
        // so re-running would execute embedded scripts a second time. The
        // returned cleanup abandons a walk that is still in flight.
        () => (embed && ref.current ? activateScripts(ref.current) : undefined),
        [embed, html]
    );
    React.useLayoutEffect(() => rewriteLinks?.(ref.current as HTMLElement), [rewriteLinks, html]);

    return React.createElement(Tag, {
        ref,
        dangerouslySetInnerHTML: {__html: html},
        ...otherProps,
        // Tag all CMS-authored markup with `cms-content` so styles for editor
        // content (e.g. buttons) can target it specifically.
        className: cn('cms-content', className)
    });
}
