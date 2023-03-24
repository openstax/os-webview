import usePageContext from '../page-context';
import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './bookings.scss';

function Booking({imageUrl, name, contact, bio, title}) {
    return (
        <div className="booking">
            <div className="card">
                {
                    Boolean(imageUrl) && <img src={imageUrl} alt={name} />
                }
            </div>
            <div className={imageUrl ? '' : 'span-2'}>
                <div className="name">{name}</div>
                <div>{title}</div>
                {
                    contact && <div>{contact}</div>
                }
            </div>
            <RawHTML className="span-2" html={bio} />
        </div>
    );
}

export default function Bookings() {
    const pageData = usePageContext();

    if (!pageData) {
        return null;
    }

    const blurb = pageData.expertsBlurb;
    const bios = pageData.expertsBios
        .map((b) => ({
            imageUrl: b.expertImage,
            name: b.name,
            title: b.title,
            contact: b.email,
            bio: b.bio
        }));

    return (
        <div className="bookings">
            <div className="heading">
                <h2>Senior leadership</h2>
                <RawHTML html={blurb} />
            </div>
            {
                bios.map((bio) => <Booking {...bio} key={bio.name} />)
            }
        </div>
    );
}
