import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './openstax-tutor.css';

const data = {
    headline: 'Courseware for online, in-person, and hybrid classrooms.',
    description: `Our innovative research-based tool provides students with
    easy-to-use online courseware they need to stay engaged while reading,
    writing and doing homework assignments. All while you, the teacher, is
    provided with insight into how your students are learning and where they
    need additional support.<br><br>
    <b>Available books:</b><br>
    Anatomy and Physiology, Biology 2e, College Physics, Biology for
    AP<sup>&reg;</sup> Courses, The AP<sup>&reg;</sup> Physics Collection,
    Psychology 2e, Introduciton to Sociology 2e, and Entrepreneurship.
    `,
    buttonUrl: 'case-study-download.pdf',
    buttonText: 'Download the case study',
    sectionHeader: 'Features',
    sectionTitle: 'How OpenStax Tutor works',
    blurbs: [
        {
            icon: '/images/campaign/features-icon-1.svg',
            title: 'Segmented reading combined with student engagement exercises',
            description: `We break textbook readings down into easy digestible
            segments that include videos, simulations and theoretical questions.`
        },
        {
            icon: '/images/campaign/features-icon-2.svg',
            title: 'Improved study techniques and increased learning success ',
            description: `Spaced practice study techniques, personalized questions
            and other features help students learn more efficiently and effectively.
            65% of students using Tutor say it helps them learn.`
        },
        {
            icon: '/images/campaign/features-icon-3.svg',
            title: 'Teachers have greater choice in how they test their students',
            description: `You can build homework assignments with questions from
            the text, additional assessments and personalized questions. Our
            performance forecast shows you where your students are struggling-as
            a class, or by student. `
        }
    ],
    resourceBlurb: `If OpenStax Tutor is not yet available for your subject,
    don’t worry. We still have dozens of available instructor resources to help
    you with your classroom.`,
    resourceUrl: 'tutor-resources',
    resourceText: 'See resources'
};

function Blurb({icon, title, description}) {
    return (
        <div className="blurb">
            <img src={icon} />
            <h3>{title}</h3>
            <div>{description}</div>
        </div>
    );
}

export default function TutorPage() {
    const {
        headline, description, buttonUrl, buttonText,
        sectionHeader, sectionTitle, blurbs,
        resourceBlurb, resourceUrl, resourceText
    } = data;

    return (
        <main className="openstax-tutor">
            <section className="banner hero">
                <div className="boxed">
                    <div className="text">
                        <h1>{headline}</h1>
                        <RawHTML className="description" html={description} />
                        <a className="btn super" href={buttonUrl}>{buttonText}</a>
                    </div>
                </div>
            </section>
            <div className="color-bar-divider">
                <img className="strips" src="/images/components/strips.svg" height="13" alt="" role="presentation" />
            </div>
            <section className="features">
                <div className="boxed">
                    <header>{sectionHeader}</header>
                    <h2>{sectionTitle}</h2>
                    <div className="blurbs">
                        {blurbs.map((blurb, i) => <Blurb {...blurb} key={i} />)}
                        <div className="resource-blurb">
                            <div>{resourceBlurb}</div>
                            <a className="btn primary" href={resourceUrl}>
                                {resourceText}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
