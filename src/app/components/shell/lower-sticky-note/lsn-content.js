import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {faHeart} from '@fortawesome/free-solid-svg-icons/faHeart';
import cn from 'classnames';
import './lower-sticky-note.scss';

function NoteContainer({withImage, children}) {
    const classes = cn('content', {'with-image': withImage});

    return (
        <div className={classes}>
            {children}
        </div>
    );
}

function NoteWithImage({bannerInfo}) {
    return (
        <NoteContainer withImage={true}>
            <img src={bannerInfo.banner_thumbnail} height="70" width="70" alt="" />
            <div className="text-side">
                <RawHTML className="blurb" html={bannerInfo.html_message} />
                <a className="cta" href={bannerInfo.link_url} data-nudge-action="interacted">
                    {bannerInfo.link_text}
                    <FontAwesomeIcon icon={faChevronRight} />
                </a>
            </div>
        </NoteContainer>
    );
}

function NoteWithoutImage({bannerInfo}) {
    return (
        <NoteContainer withImage={false}>
            <RawHTML className="blurb" html={bannerInfo.html_message} />
            <a className="cta" href={bannerInfo.link_url} data-nudge-action="interacted">
                <FontAwesomeIcon icon={faHeart} className="red-heart" />
                {bannerInfo.link_text}
                <FontAwesomeIcon icon={faChevronRight} />
            </a>
        </NoteContainer>
    );
}

export default function LowerStickyNote({stickyData, PutAway}) {
    return (
        <div
            className={
                cn(
                    'lower-sticky-note-content',
                    {'with-image': stickyData.bannerInfo.banner_thumbnail}
                )
            }
            data-analytics-view
            data-analytics-nudge="donate"
            data-nudge-placement="banner"
            role="dialog"
            aria-label="sticky note"
        >
            <PutAway />
            {
                stickyData.bannerInfo.banner_thumbnail ?
                    <NoteWithImage bannerInfo={stickyData.bannerInfo} /> :
                    <NoteWithoutImage bannerInfo={stickyData.bannerInfo} />
            }
        </div>
    );
}
