import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import cn from 'classnames';
import type {BannerInfo} from '../shared';
import './lower-sticky-note.scss';

function NoteContainer({withImage, children}: React.PropsWithChildren<{
    withImage: boolean;
}>) {
    const classes = cn('content', {'with-image': withImage});

    return (
        <div className={classes}>
            {children}
        </div>
    );
}

function CtaLink({bannerInfo}: {bannerInfo: BannerInfo}) {
    if (!bannerInfo.link_url || !bannerInfo.link_text) {
        return null;
    }
    return (
        <a className="cta" href={bannerInfo.link_url} data-nudge-action="interacted">
            {bannerInfo.link_text}
            <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
        </a>
    );
}

function NoteWithImage({bannerInfo}: {bannerInfo: BannerInfo}) {
    return (
        <NoteContainer withImage={true}>
            <img src={bannerInfo.banner_thumbnail} height="70" width="70" alt="" />
            <div className="text-side">
                <RawHTML className="blurb" html={bannerInfo.html_message} />
                <CtaLink bannerInfo={bannerInfo} />
            </div>
        </NoteContainer>
    );
}

function NoteWithoutImage({bannerInfo}: {bannerInfo: BannerInfo}) {
    return (
        <NoteContainer withImage={false}>
            <RawHTML className="blurb" html={bannerInfo.html_message} />
            <CtaLink bannerInfo={bannerInfo} />
        </NoteContainer>
    );
}

export default function LowerStickyNote({bannerInfo, PutAway}: {
    bannerInfo: BannerInfo;
    PutAway: () => React.JSX.Element;
}) {
    const hasImage = Boolean(bannerInfo.banner_thumbnail);

    return (
        <div
            className={
                cn(
                    'lower-sticky-note-content',
                    {'with-image': hasImage}
                )
            }
            data-analytics-view
            data-analytics-nudge="donate"
            data-nudge-placement="banner"
            data-banner-variant={bannerInfo.name}
            role="complementary"
            aria-label="Donation campaign announcement"
            aria-live="polite"
            aria-atomic="true"
        >
            <PutAway />
            {
                hasImage ?
                    <NoteWithImage bannerInfo={bannerInfo} /> :
                    <NoteWithoutImage bannerInfo={bannerInfo} />
            }
        </div>
    );
}
