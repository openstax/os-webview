import React from 'react';
import CarouselSection from './components/carousel-section';
import useSpecificSubjectContext from './context';
import './blog-posts.scss';

function Card({image, linkText, link}) {
    return (
        <div className="card">
            <img src={image} role="presentation" />
            <a href={link}>{linkText}</a>
        </div>
    );
}

export default function BlogPosts({subjectName}) {
    const {
        blogHeader: {content: {blogDescription, linkText, linkHref}}
    } = useSpecificSubjectContext();
    const blurbs = [];

    return (
        <CarouselSection
            id="blog-posts" className="blog-posts"
            heading={`Blog posts about OpenStax ${subjectName} textbooks`}
            description={blogDescription}
            linkUrl={linkHref} linkText={linkText}
        >
            <a><h2>Blurbs should be queried here</h2></a>
            {blurbs.map((blurb) => <Card {...blurb} key={blurb.link} />)}
        </CarouselSection>
    );
}
