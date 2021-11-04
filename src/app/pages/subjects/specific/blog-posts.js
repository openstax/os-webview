import React from 'react';
import {useParams} from 'react-router-dom';
import Carousel from '~/components/carousel/carousel';
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

export default function BlogPosts() {
    const {subject} = useParams();

    return (
        <section id="blog-posts" className="blog-posts">
            <div className="content">
                <div className="top">
                    <h1>Blog posts about OpenStax {subject} textbooks</h1>
                    <div>{sectionDescription}</div>
                </div>
                <a className="btn primary" href={viewAllUrl}>
                    {viewAllText}
                </a>
                <Carousel mobileSlider>
                    {blurbs.map((blurb) => <Card {...blurb} key={blurb.link} />)}
                </Carousel>
            </div>
        </section>
    );
}
