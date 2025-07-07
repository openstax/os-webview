import React from 'react';
import usePageContext from '../page-context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {ContentBlock} from '../helpers';
import {assertDefined} from '~/helpers/data';

export default function AboutOpenStax() {
    const {about} = assertDefined(usePageContext());

    return (
        <ContentBlock title="About OpenStax">
            <RawHTML html={about} />
        </ContentBlock>
    );
}
