import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import Copyright from './copyright';
import CookieYesToggle from './cookie-yes-toggle';
import ListOfLinks from '~/components/list-of-links/list-of-links';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons/faFacebookF';
import {faXTwitter} from '@fortawesome/free-brands-svg-icons/faXTwitter';
import {faLinkedinIn} from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import {faInstagram} from '@fortawesome/free-brands-svg-icons/faInstagram';
import {faYoutube} from '@fortawesome/free-brands-svg-icons/faYoutube';
import {faTiktok} from '@fortawesome/free-brands-svg-icons/faTiktok';
import {faThreads} from '@fortawesome/free-brands-svg-icons/faThreads';
import {faBluesky} from '@fortawesome/free-brands-svg-icons/faBluesky';
import {faMastodon} from '@fortawesome/free-brands-svg-icons/faMastodon';
import usePortalContext from '~/contexts/portal';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import './footer.scss';

type FooterMenuItem = {
    label: string;
    partial_url: string;
    key?: string;
};

type FooterMenuColumn = {
    key: string;
    name: string;
    menu: FooterMenuItem[];
};

type SocialLink = {
    platform: string;
    url: string;
};

type FooterData = {
    supporters: string;
    copyright: string;
    apStatement: string;
    socialLinks?: SocialLink[];
};

const socialPlatforms: {[key: string]: {icon: IconDefinition; label: string}} = {
    facebook: {icon: faFacebookF, label: 'Facebook'},
    twitter: {icon: faXTwitter, label: 'X'},
    linkedin: {icon: faLinkedinIn, label: 'LinkedIn'},
    instagram: {icon: faInstagram, label: 'Instagram'},
    youtube: {icon: faYoutube, label: 'YouTube'},
    tiktok: {icon: faTiktok, label: 'TikTok'},
    threads: {icon: faThreads, label: 'Threads'},
    bluesky: {icon: faBluesky, label: 'Bluesky'},
    mastodon: {icon: faMastodon, label: 'Mastodon'}
};

function useFooterColumns() {
    const structure = useDataFromSlug<FooterMenuColumn[]>('oxmenus/?placement=footer');

    return Array.isArray(structure) ? structure : [];
}

function FooterColumns({columns}: {columns: FooterMenuColumn[]}) {
    if (!columns.length) {
        return null;
    }

    const policiesIndex = columns.findIndex((column) => column.key === 'policies');
    const cookieToggleIndex = policiesIndex === -1 ? columns.length - 1 : policiesIndex;

    return (
        <React.Fragment>
            {columns.map((column, index) => (
                <div className={`column col${index + 1}`} key={column.key}>
                    <h3>{column.name}</h3>
                    <ListOfLinks>
                        {column.menu.map((item) => (
                            <a href={item.partial_url} key={item.key ?? item.label}>
                                {item.label}
                            </a>
                        ))}
                        {index === cookieToggleIndex ? <CookieYesToggle /> : null}
                    </ListOfLinks>
                </div>
            ))}
        </React.Fragment>
    );
}

function SocialLinks({links}: {links: SocialLink[]}) {
    return (
        <ul className="social">
            {links.map((link) => {
                const platform = socialPlatforms[link.platform];

                if (!platform) {
                    return null;
                }

                return (
                    <li key={link.platform}>
                        <a
                            className={`btn btn-social ${link.platform}`}
                            href={link.url}
                            title={`OpenStax on ${platform.label}`}
                        >
                            <FontAwesomeIcon icon={platform.icon} />
                        </a>
                    </li>
                );
            })}
            <li>
                <a className="rice-logo" href="http://www.rice.edu">
                    <img
                        src="/dist/images/rice-logo-white.png"
                        alt="Rice University logo"
                        width="99"
                        height="40"
                    />
                </a>
            </li>
        </ul>
    );
}

function Footer({
    data: {
        supporters,
        copyright,
        apStatement,
        socialLinks
    }
}: {
    data: FooterData;
}) {
    const {rewriteLinks} = usePortalContext();
    const columns = useFooterColumns();

    React.useLayoutEffect(
        () =>
            rewriteLinks?.(
                document.querySelector('.page-footer') as HTMLElement
            ),
        [rewriteLinks]
    );

    return (
        <React.Fragment>
            <div className="top">
                <div className="boxed">
                    <RawHTML html={supporters} />
                    <FooterColumns columns={columns} />
                </div>
            </div>
            <div className="bottom">
                <div className="boxed">
                    <div className="copyrights">
                        <Copyright
                            copyright={copyright}
                            apStatement={apStatement}
                        />
                    </div>
                    <SocialLinks links={socialLinks ?? []} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default function FooterLoader() {
    return (
        <div className="page-footer" data-analytics-nav="Footer">
            <LoaderPage slug="footer" Child={Footer} />
        </div>
    );
}
