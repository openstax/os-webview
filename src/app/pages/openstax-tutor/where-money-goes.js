import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

export default function WhereMoneyGoes({model}) {
    return (
        <section id="where-money-goes">
            <div className="text-content">
                <h1>{model.section5Heading}</h1>
                <RawHTML className="section-description" html={model.section5Paragraph} />
            </div>
            <img
                className="boxed big-screen"
                src="/images/openstax-tutor/ten-dollars.svg"
                alt="Diagram of how we spend money"
                aria-describedby="breakdown-description"
            />
            <div id="breakdown-description" style="visibility: hidden; height: 0">
                $5 pays for our engineers and researchers.
                $3 pays for authors to keep content current.
                $1 pays for our Support team.
                $1 helps us keep the lights on.
            </div>
            <div className="boxed small-screen">
                <img src="/images/openstax-tutor/ten-dollars-mobile@2x.png" alt="breakdown of 10 dollars" />
                <div className="box">
                    <div className="flexrow">
                        <div className="dot dot-1"></div>
                        <div>Pays for our engineers and researchers</div>
                    </div>
                    <div className="flexrow">
                        <div className="dot dot-2"></div>
                        <div>Pays for authors to keep content current</div>
                    </div>
                    <div className="flexrow">
                        <div className="dot dot-3"></div>
                        <div>Pays for our Support team</div>
                    </div>
                    <div className="flexrow">
                        <div className="dot dot-4"></div>
                        <div>Helps us keep the lights on</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
