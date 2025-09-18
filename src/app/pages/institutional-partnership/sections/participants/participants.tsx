import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import groupBy from 'lodash/groupBy';
import EstablishedPartners from './established-partners/established-partners';
import Dialog from '~/components/dialog/dialog';
import {useToggle} from '~/helpers/data';
import './participants.scss';

export type Icon = {
    currentCohort: boolean;
    image: {
        image: string;
    };
    // TODO - verify whether it's this or altText or what
    imageAltText: string;
};

export type ParticipantsProps = {
    heading: string;
    subheading: string;
    icons: [Icon[]];
    linkTarget: string;
    linkText: string;
};

export default function Participants({
    heading, subheading, icons: [icons], linkTarget, linkText
}: ParticipantsProps) {
    const {true: current, false: established} = groupBy(icons, 'currentCohort') as {
        true?: Icon[];
        false?: Icon[];
    };
    const [isOpen, toggle] = useToggle();

    function showEstablished(event: React.MouseEvent<HTMLAnchorElement>) {
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
                            <img key={icon.image.image} src={icon.image.image} alt={icon.imageAltText} />
                        )
                    }
                </div>
                <a
                    className="show-established-partners"
                    href={linkTarget}
                    onClick={showEstablished}
                >
                    <span>{linkText}</span>
                    <FontAwesomeIcon icon={faChevronRight} />
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
