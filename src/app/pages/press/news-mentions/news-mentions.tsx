import React from 'react';
import {assertDefined} from '~/helpers/data';
import usePageContext from '../page-context';
import {convertedDate, asDate, ContentBlock, PressExcerpt} from '../helpers';
import {Paginated} from '~/components/more-fewer/more-fewer';

export default function NewsMentions() {
    const newsMentions = assertDefined(usePageContext()).mentions
        .map((obj) => ({
            iconUrl: obj.source.logo,
            source: obj.source.name,
            date: convertedDate(obj.date),
            asDate: asDate(obj.date),
            headline: obj.headline,
            url: obj.url
        }))
        .sort((a, b) => b.asDate.getTime() - a.asDate.getTime());

    return (
        <ContentBlock title="News mentions">
            <Paginated perPage={7}>
                {newsMentions.map((props) => (
                    <PressExcerpt {...props} key={props.url} />
                ))}
            </Paginated>
        </ContentBlock>
    );
}
