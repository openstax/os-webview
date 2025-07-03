import React from 'react';
import {assertDefined} from '~/helpers/data';
import usePageContext from '../page-context';
import {ContentBlock} from '../helpers';

export default function Infographic() {
    const {infographicText, infographicImage} = assertDefined(usePageContext());

    return (
        <ContentBlock title={infographicText}>
            <img
                src={infographicImage.meta.downloadUrl}
                alt={infographicImage.title}
            />
        </ContentBlock>
    );
}
