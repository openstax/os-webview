import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import type {K12Data} from './k12-main';
import './features.scss';

function Card({data: {icon, title, description}}: {data: K12Data['featuresCards'][0]}) {
    return (
        <div className="card">
            <img src={icon.file} alt={icon.title} width="50" height="50" />
            <div>
                <h2>{title}</h2>
                <RawHTML html={description} />
            </div>
        </div>
    );
}

export default function Features({data}: {data: K12Data}) {
    return (
        <section className="features">
            <div className="boxed">
                {
                    data.featuresCards.map((d) => <Card key={d.title} data={d} />)
                }
            </div>
        </section>
    );
}
