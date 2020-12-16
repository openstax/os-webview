import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import groupBy from 'lodash/groupBy';
import './participants.css';
import EstablishedPartners from './established-partners/established-partners';
import shellBus from '~/components/shell/shell-bus';

export default function Participants({
    heading, subheading, icons: [icons], linkTarget, linkText, ...other
}) {
    const {true: current, false: established} = groupBy(icons, 'currentCohort');

    function showEstablished(event) {
        event.preventDefault();
        shellBus.emit('showDialog', () => ({
            title: 'Established Partners',
            content: new EstablishedPartners({model: established})
        }));
    }

    return (
        <section className="participants white">
            <div className="content-block">
                <h2>{heading}</h2>
                <h3>{subheading}</h3>
                <div className="icons">
                    {
                        current && current.map((icon) =>
                            <img key={icon} src={icon.image.image} alt={icon.imageAltText} />
                        )
                    }
                </div>
                <a
                    className="show-established-partners"
                    href="{linkTarget}"
                    onClick={showEstablished}
                >
                    <span>{linkText}</span>
                    <FontAwesomeIcon icon="chevron-right" />
                </a>
            </div>
        </section>
    );
}
