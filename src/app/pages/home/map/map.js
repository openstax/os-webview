import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './map.scss';

export default function Map() {
    const htmlBlock = `<b>9 million students at 7,000 + schools use OpenStax.</b>
    Learn more about our global reach, and put your school on the map!`;
    const buttonText = 'Explore our interactive map';

    return (
        <section className="the-map">
            <div className="content">
                <div className="floating-box">
                    <RawHTML html={htmlBlock} />
                    <a href="/separatemap" className="btn primary">
                        {buttonText}
                    </a>
                    <div className="credit">
                        Map vector by{' '}
                        <a href="https://www.freevector.com/dot-world-vector-24978#">
                            FreeVector.com
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
