import React from 'react';
import ClippedImage from '~/components/clipped-image/clipped-image';
import useAccount from '~/pages/my-openstax/store/use-account';
import './assistant.scss';

function Card({data}) {
    return (
        <React.Fragment>
            <h3>{data.headline}</h3>
            <div className="card">
                <ClippedImage src={data.img} alt="" />
                <div className="text-block">
                    <div className="title">{data.title}</div>
                    <a className="btn" href={data.url}>{data.linkText}</a>
                </div>
            </div>
            <div className="questions">
                {
                    data.questions.map((q) =>
                        <a href={q.url} key={q.text}>{q.text}</a>
                    )
                }
            </div>
        </React.Fragment>
    );
}

const cards = [
    {
        headline: 'Getting Started',
        img: '/images/my-openstax/getting-started.png',
        title: 'Instructor Getting Started Guide',
        url: 'https://assets.openstax.org/oscms-dev/media/documents/instructor_getting_started_guide_1.pdf',
        linkText: 'Download',
        questions: [
            {
                url: '/faq',
                text: 'Frequently Asked Questions'
            },
            {
                url: 'http://www2.openstax.org/l/218812/2016-10-04/lvk',
                text: 'Sign up for our Newsletter'
            }
        ]
    },
    {
        headline: 'Getting Connected',
        img: '/images/my-openstax/getting-connected.png',
        title: 'Webinars about our books, resources, and more',
        url: '/webinars',
        linkText: 'Browse',
        questions: [
            {
                url: 'https://www.oercommons.org/groups/openstax-algebra-and-trigonometry/1045/?__hub_id=27',
                text: 'OER Commons HUB Resources'
            }
        ]
    },
    {
        headline: 'Support',
        img: '/images/my-openstax/support.png',
        title: 'OpenStax Support',
        url: '/help',
        linkText: 'Visit',
        questions: [
            {
                url: '/contact',
                text: 'Email us'
            }
        ]
    }
];

export default function Assistant({id, hidden}) {
    const {firstName} = useAccount();

    return (
        <section id={id} hidden={hidden}>
            <h2>My Assistant</h2>
            <div className="welcome">
                <img src="/images/my-openstax/assistant-avatar.svg" height="44" width="44" />
                <div>
                    <b>Welcome, {firstName}!</b><br />
                    I’ve collected some of the most useful resources here for you,
                    to help you start with OpenStax.
                </div>
            </div>
            <div className="cards">
                {cards.map((c) => <Card key={c.headline} data={c} />)}
            </div>
        </section>
    );
}
