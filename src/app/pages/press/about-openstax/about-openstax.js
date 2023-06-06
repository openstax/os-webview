import React from 'react';
import usePageContext from '../page-context';
import RawHTML from '~/components/jsx-helpers/raw-html';

export default function AboutOpenStax() {
    const {about} = usePageContext();

    return (
        <div className='content-block'>
            <h2>About OpenStax</h2>
            <RawHTML html={about} />
        </div>
    );
}
