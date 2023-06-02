import usePageContext from '../page-context';
import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './leadership.scss';

function Bio({imageUrl, name, contact, bio, title}) {
    return (
        <div className='bio'>
            <div className='card'>
                {Boolean(imageUrl) && <img src={imageUrl} alt={name} />}
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
    const pageData = usePageContext();

    if (!pageData) {
        return null;
    }

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
