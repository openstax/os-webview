import PageContext from '../page-context';
import React, {useContext} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import css from './bookings.css';

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
    const pageData = useContext(PageContext);

    if (!pageData) {
        return null;
    }

    const blurb = pageData.experts_blurb;
    const bios = pageData.experts_bios
        .map((b) => ({
            imageUrl: b.expert_image,
            name: b.name,
            title: b.title,
            contact: b.email,
            bio: b.bio
        }));

    return (
        <div className="bookings">
            <div className="heading">
                <h2>Book our experts</h2>
                <RawHTML html={blurb} />
            </div>
            {
                bios.map((bio) => <Booking {...bio} />)
            }
        </div>
    );
}
