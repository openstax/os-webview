import React from 'react';
import {assertDefined} from '~/helpers/data';
import usePageContext from '../page-context';
import MoreFewer from '~/components/more-fewer/more-fewer';
import {convertedDate, asDate, PressExcerpt} from '../helpers';
import './press-releases.scss';

export default function PressReleases({excludeSlug='', Container = MoreFewer}) {
    const {releases} = assertDefined(usePageContext());

    const pressReleases = Object.entries(releases)
        .filter(([slug]) => slug !== excludeSlug)
        .map(([slug, release]) => ({
            author: release.author,
            date: convertedDate(release.date),
            asDate: asDate(release.date),
            url: `/${slug}`,
            headline: release.heading,
            excerpt: release.excerpt
        }))
        .sort((a, b) => b.asDate.getTime() - a.asDate.getTime());

    return (
        <div className='content-block'>
            <h2>Press releases</h2>
            <Container pluralItemName='press releases'>
                {pressReleases.map((props) => (
                    <PressExcerpt {...props} key={props.url} />
                ))}
            </Container>
        </div>
    );
}
