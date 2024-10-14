import React from 'react';
import CarouselSection from './components/carousel-section';
import useSpecificSubjectContext from './context';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import useOptimizedImage from '~/helpers/use-optimized-image';
import useEnglishSubject from './use-english-subject';
import {useIntl} from 'react-intl';
import './blog-posts.scss';
import { assertDefined } from '~/helpers/data';

type Blurb = {
    id: number;
    article_image: string;
    title: string;
    slug: string;
}

function Card({article_image: image, title: linkText, slug}: Omit<Blurb, 'id'>) {
    const link = `/blog/${slug}`;
    const optimizedImage = useOptimizedImage(image, 400);

    return (
        <div className="card">
            <img src={optimizedImage} role="presentation" />
            <a href={link}>{linkText}</a>
        </div>
    );
}

function BlogPosts() {
    const {
        content: {heading, blogDescription, linkText, linkHref}
    } = assertDefined(useSpecificSubjectContext().blogHeader);
    const cms = useEnglishSubject();
    const blurbs: Blurb[] = useDataFromSlug(`search/?subjects=${cms}`) || [];
    const intl = useIntl();

    return (
        blurbs.length ?
            <CarouselSection
                heading={heading}
                description={blogDescription}
                linkUrl={linkHref} linkText={linkText}
                thing='blog entries'
                minWidth={260}
            >
                {blurbs.map((blurb) => <Card {...blurb} key={blurb.id} />)}
            </CarouselSection> :
            <h2>{intl.formatMessage({id: 'subject.noBlog'})}</h2>
    );
}

export default function MaybeBlogPosts() {
    const ctx = useSpecificSubjectContext();

    if (!ctx?.blogHeader) {
        return null;
    }

    return (
        <BlogPosts />
    );
}
