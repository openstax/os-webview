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
        blogSectionDescription: sectionDescription,
        blogSectionViewAllUrl: viewAllUrl,
        blogSectionViewAllText: viewAllText,
        blogSectionBlurbs: blurbs
    } = useSpecificSubjectContext();

    return (
        <CarouselSection
            id="blog-posts" className="blog-posts"
            heading={`Blog posts about OpenStax ${subjectName} textbooks`}
            description={sectionDescription}
            linkUrl={viewAllUrl} linkText={viewAllText}
        >
            {blurbs.map((blurb) => <Card {...blurb} key={blurb.link} />)}
        </CarouselSection>
    );
}
