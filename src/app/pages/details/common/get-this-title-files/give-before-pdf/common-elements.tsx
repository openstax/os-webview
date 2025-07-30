import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import {useLocation} from 'react-router-dom';

type Data = {
    header_subtitle: string;
    header_image: string;
    header_title: string;
    give_link_text: string;
    thank_you_link: string;
    thank_you_link_text: string;
    giving_optional: string;
};

export default function CommonElements({
    data,
    onThankYouClick,
    headerSubtitle = data.header_subtitle,
    giveLink
}: {
    data: Data;
    onThankYouClick: React.MouseEventHandler;
    headerSubtitle?: string;
    giveLink: string;
}) {
    const initialItem = React.useRef<HTMLAnchorElement>(null);
    const {pathname} = useLocation();

    React.useEffect(() => initialItem.current?.focus(), []);
    return (
        <React.Fragment>
            {pathname.startsWith('/k12') ? (
                <img
                    className="k12-header-image"
                    src='/dist/images/k12/download-resource.jpg'
                    alt=""
                    width="240"
                />
            ) : (
                <img
                    className="header-image"
                    src={data.header_image}
                    alt=""
                    height="165"
                    width="165"
                />
            )}
            <p>
                <span className="header-title">{data.header_title}</span>
                <br />
                <span>{headerSubtitle}</span>
            </p>
            <div className="button-row">
                <a
                    href={giveLink}
                    className="btn primary"
                    onClick={OpenGiveInNewWindow}
                    data-nudge-action="interacted"
                    ref={initialItem}
                >
                    {data.give_link_text}
                    <FontAwesomeIcon icon={faHeart} />
                </a>
                <a
                    href={data.thank_you_link}
                    className="btn secondary"
                    onClick={onThankYouClick}
                    data-nudge-action="thank-you"
                >
                    {data.thank_you_link_text}
                </a>
            </div>
            <p className="giving-optional">{data.giving_optional}</p>
            <hr />
        </React.Fragment>
    );
}

function OpenGiveInNewWindow(event: React.MouseEvent) {
    event.preventDefault();
    const url = (event.target as HTMLAnchorElement).href;
    const {innerWidth, innerHeight} = window;
    const w = 0.8 * innerWidth;
    const h = 0.8 * innerHeight;

    window.open(url, 'givewindow', `menubar=0,width=${w},height=${h}`);
}
