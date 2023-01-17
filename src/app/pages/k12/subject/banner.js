import React from 'react';
import './banner.scss';

const data = {
    category: 'High School Science',
    subject: 'Biology',
    description: `Biology textbooks are designed to cover the scope and sequence
    requirements of a typical two-semester biology course. The text provides
    comprehensive coverage of foundational research and core biology concepts
    through an evolutionary lens. Biology includes rich features that engage
    students in scientific inquiry, highlight careers in the biological sciences,
    and offer everyday applications. Books also include various types of practice
    and homework questions that help students understand—and apply—key concepts.`,
    imageUrl: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435'
};


export default function Banner() {
    const bgStyle = {backgroundImage: `url(${data.imageUrl})`};

    return (
        <section className="banner">
            <div className="boxed">
                <div className="text-block">
                    <div className="category">{data.category}</div>
                    <h1>{data.subject}</h1>
                    <div>{data.description}</div>
                </div>
                <div className="right-bg" style={bgStyle} />
            </div>
        </section>
    );
}
