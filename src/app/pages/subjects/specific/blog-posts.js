import React from 'react';
import CarouselSection from './components/carousel-section';
import './blog-posts.scss';

const sectionDescription = `Read up on best practices for using our free
business textbooks and instructor resources in your course in these blog
posts.`;
const viewAllText = 'View all blog posts';
const viewAllUrl = '/blog';
const blurbs = [
    {
        image: 'https://assets.openstax.org/oscms-prodcms/media/documents/calculus-v2.svg',
        linkText: 'Curated community resources for OpenStax business books',
        link: 'google1.com'
    },
    {
        image: 'https://assets.openstax.org/oscms-prodcms/media/documents/college_algebra.svg',
        linkText: 'What makes OpenStax Principles of Accounting unique',
        link: 'google2.com'
    },
    {
        image: 'https://assets.openstax.org/oscms-prodcms/media/original_images/AdobeStock_382934760.png',
        linkText: 'Answering your FAQs about OpenStax (Business) textbooks',
        link: 'google3.com'
    }
];

function Card({image, linkText, link}) {
    return (
        <div className="card">
            <img src={image} role="presentation" />
            <a href={link}>{linkText}</a>
        </div>
    );
}

export default function BlogPosts({subjectName}) {
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
