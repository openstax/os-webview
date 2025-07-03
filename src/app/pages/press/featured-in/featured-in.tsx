import React from 'react';
import usePageContext from '../page-context';
import {assertDefined} from '~/helpers/data';
import {ContentBlock} from '../helpers';
import './featured-in.scss';

export default function FeaturedIn() {
    const {featuredIn} = assertDefined(usePageContext());

    return (
        <ContentBlock title="Featured in">
            <div className="link-grid">
                {featuredIn.map((obj) => (
                    <a key={obj.image} href={obj.url}>
                        <img src={obj.image} alt={obj.name} />
                    </a>
                ))}
            </div>
        </ContentBlock>
    );
}
