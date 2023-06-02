import React from 'react';
import usePageContext from '../page-context';
import {convertedDate, asDate, PressExcerpt} from '../helpers';
import {Paginated} from '~/components/more-fewer/more-fewer';

export default function NewsMentions() {
    const pageData = usePageContext();

    const newsMentions = pageData.mentions
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
        <div className='content-block'>
            <h2>News mentions</h2>
            <Paginated perPage={7}>
                {newsMentions.map((props) => (
                    <PressExcerpt {...props} key={props.url} />
                ))}
            </Paginated>
        </div>
    );
}
