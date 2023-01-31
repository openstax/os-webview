import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './features.scss';

function Card({data: {icon, title, description}}) {
    return (
        <div className="card">
            <img src={icon.file} alt={icon.title} />
            <div>
                <h2>{title}</h2>
                <RawHTML html={description} />
            </div>
        </div>
    );
}

export default function Features({data}) {
    return (
        <section className="three-cards">
            <div className="boxed">
                {
                    data.featuresCards.map((d) => <Card key={d.head} data={d} />)
                }
            </div>
        </section>
    );
}
