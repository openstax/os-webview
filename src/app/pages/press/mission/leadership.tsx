import React from 'react';
import {assertDefined} from '~/helpers/data';
import usePageContext from '../page-context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './leadership.scss';

function Bio({imageUrl, name, contact, bio, title}: {
    imageUrl: string | null;
    name: string;
    contact: string;
    bio: string;
    title: string;
}) {
    return (
        <div className='bio'>
            <div className='card'>
                {imageUrl !== null && <img src={imageUrl} alt={name} />}
            </div>
            <div className={imageUrl ? '' : 'span-2'}>
                <div className='name'>{name}</div>
                <div>{title}</div>
                {contact && <div>{contact}</div>}
            </div>
            <RawHTML className='span-2' html={bio} />
        </div>
    );
}

export default function Leadership() {
    const pageData = assertDefined(usePageContext());
    const blurb = pageData.expertsBlurb;
    const bios = pageData.expertsBios.map((b) => ({
        imageUrl: b.expertImage,
        name: b.name,
        title: b.title,
        contact: b.email,
        bio: b.bio
    }));

    return (
        <div className='leadership'>
            <div className='heading'>
                <h2>Senior leadership</h2>
                <RawHTML html={blurb} />
            </div>
            {bios.map((bio) => (
                <Bio {...bio} key={bio.name} />
            ))}
            <div className='bottom-link'>
                <a href='/team'>Meet the full team</a>
            </div>
        </div>
    );
}
