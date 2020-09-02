import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function Feature({feature}) {
    const availableClass = (feature.available || feature.alternateText) ? 'true' : 'false';

    return (
        <div className="flexrow">
            <FontAwesomeIcon icon="check-circle" className={availableClass} />
            <div>
                {feature.name}
                {
                    feature.alternateText &&
                        <React.Fragment>
                            <br />
                            <span>{feature.alternate_text}</span>
                        </React.Fragment>
                }
            </div>
        </div>
    );
}

export default function Features({model}) {
    return (
        <section id="feature-matrix">
            <div className="text-content two-cells">
                <div className="cell">
                    <h1 className="small-screen">{model.section4Heading}</h1>
                    {
                        model.resourceAvailability.map((feature) =>
                            <Feature feature={feature} key={feature.name} />
                        )
                    }
                    <div className="flexrow caption smaller">
                        <FontAwesomeIcon icon="check-circle" className="spacer" />
                        {model.section4ResourceFinePrint}
                    </div>
                </div>
                <div className="cell">
                    <h1 className="big-screen">{model.section4Heading}</h1>
                    <RawHTML className="description" html={model.section4Paragraph} />
                    <div className="box">
                        <h2>{model.section4ComingSoonHeading}</h2>
                        <RawHTML className="future-text" html={model.section4ComingSoonText} />
                        <div className="stamp" role="presentation"></div>
                        <div className="bottom-edge" role="presentation"></div>
                        <div className="gradient-strip"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
