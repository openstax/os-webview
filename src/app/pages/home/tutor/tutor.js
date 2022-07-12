import React from 'react';
import './tutor.scss';

function Buttons({data}) {
    return (
        <div className="buttons">
            <a className="btn primary" href={data.buttonLink}>{data.buttonText}</a>
            <a className="btn" href={data.demoLink}>{data.demoText}</a>
        </div>
    );
}

function IconGroup({icon, text}) {
    return (
        <div className="icon-group">
            <img src={icon} alt />
            {text}
        </div>
    );
}

export default function ComponentTemplate({data}) {
    return (
        <section className="tutor">
            <div className="boxed">
                <div className="text-block">
                    <img src={data.logo} alt="OpenStax Tutor" />
                    <div>{data.description}</div>
                    <Buttons data={data} />
                </div>
                <div className="icon-block">
                    {
                        data.features[0].map((f, key) =>
                            <IconGroup key={key} icon={f.image?.file} text={f.title} />
                        )
                    }
                </div>
            </div>
        </section>
    );
}
