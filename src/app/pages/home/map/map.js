import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './map.scss';

export default function Map({data: {text, buttonText}}) {
    return (
        <section className="the-map">
            <div className="content">
                <div className="floating-box">
                    <RawHTML html={text} />
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
