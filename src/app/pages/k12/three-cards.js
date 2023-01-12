import React from 'react';
import './three-cards.scss';

function Card({data: {head, body}}) {
    return (
        <div className="card">
            <img src="https://osk12-test.herokuapp.com/static/images/lightbulb_iconsvg.svg" alt="light bulb" />
            <div>
                <h2>{head}</h2>
                <p>{body}</p>
            </div>
        </div>
    );
}

export default function ThreeCards() {
    const data = [
        {
            head: 'No cost to you - or your students',
            body: 'Save money and skip the headache. All OpenStax textbooks and resources are 100% free for you' +
            ' and your students.'
        },
        {
            head: 'No cost to you - or your students',
            body: 'Save money and skip the headache. All OpenStax textbooks and resources are 100% free for you' +
            ' and your students.'
        },
        {
            head: 'No cost to you - or your students',
            body: 'Save money and skip the headache. All OpenStax textbooks and resources are 100% free for you' +
            ' and your students.'
        }
    ];

    return (
        <section className="three-cards">
            <div className="boxed">
                {
                    data.map((d) => <Card key={d.head} data={d} />)
                }
            </div>
        </section>
    );
}
