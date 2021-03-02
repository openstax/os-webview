import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import groupBy from 'lodash/groupBy';
import EstablishedPartners from './established-partners/established-partners';
import Dialog from '~/components/dialog/dialog.jsx';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './participants.css';

export default function Participants({
    heading, subheading, icons: [icons], linkTarget, linkText, ...other
}) {
    const {true: current, false: established} = groupBy(icons, 'currentCohort');
    const [isOpen, toggle] = useToggle();

    function showEstablished(event) {
        event.preventDefault();
        toggle();
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
            <Dialog
                isOpen={isOpen} onPutAway={toggle}
                title="Established Partners"
                closeOnOutsideClick
            >
                <EstablishedPartners model={established} />
            </Dialog>
        </section>
    );
}
