import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function HowItWorks({model}) {
    const blurbs = [1, 2, 3, 4].map((num) => (
        {
            headline: model[`icon${num}Subheading`],
            iconDescription: `${model[`icon${num}Subheading`]}`,
            description: model[`icon${num}Paragraph`],
            imageUrl: model[`icon${num}ImageUrl`]
        }
    ));

    return (
        <section id="how-it-works">
            <div id="how-it-works-target"></div>
            <div className="text-content">
                <h1 className="boxed">{model.section2Heading}</h1>
                <h2>{model.section2Subheading}</h2>
                <RawHTML className="description" html={model.section2Paragraph} />
            </div>
            <div className="blurb-table boxed">
                {
                    blurbs.map((item) =>
                        <div className="blurb" key={item.description}>
                            <div className="icon">
                                <img alt={item.iconDescription} src={item.imageUrl} />
                            </div>
                            <h3>{item.headline}</h3>
                            <div className="smaller">{item.description}</div>
                        </div>
                    )
                }
            </div>
        </section>
    );
}
