import React from 'react';
import CarouselSection from './components/carousel-section';
import useSpecificSubjectContext from './context';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './blog-posts.scss';

function Card({article_image: image, title: linkText, slug}) {
    const link = `/blog/${slug}`;

    return (
        <div className="card">
            <img src={image} role="presentation" />
            <a href={link}>{linkText}</a>
        </div>
    );
}

export default function BlogPosts() {
    const {
        title,
        blogHeader: {content: {heading, blogDescription, linkText, linkHref}}
    } = useSpecificSubjectContext();
    const blurbs = useDataFromSlug(`search/?subjects=${title}`) || [];

    return (
        blurbs.length ?
            <CarouselSection
                id="blog-posts" className="blog-posts"
                heading={heading}
                description={blogDescription}
                linkUrl={linkHref} linkText={linkText}
            >
                {blurbs.map((blurb) => <Card {...blurb} key={blurb.link} />)}
            </CarouselSection> :
            <h2>No blog entries found (yet)</h2>
    );
}
