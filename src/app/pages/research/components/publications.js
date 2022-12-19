import React, {useRef, useState} from 'react';
import {isMobileDisplay} from '~/helpers/device';
import {publications} from '~/pages/research/data/research-data';
import {Section} from '~/pages/research/components/section';
import {Box} from 'boxible';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {colors} from '~/pages/research/theme';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';

export const Publications = () => {
    const [viewAll, setViewAll] = useState(false);
    const initialCount = isMobileDisplay() ? 3 : 5;
    const publicationList = viewAll ? publications : publications.slice(0, initialCount);

    const publicationsRef = useRef(null);
    const scrollToPublications = () => {
        publicationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Section>
            <Box direction='column' ref={publicationsRef}>
                <h2>Publications</h2>
                {publicationList.map((publication, index) =>
                    <PublicationItem key={index} publication={publication} />
                )}
                <span
                    className='py-4'
                    onClick={() => {
                        if (viewAll) {
                            scrollToPublications();
                        }
                        setViewAll(!viewAll);
                    }}
                    css={{
                        cursor: 'pointer',
                        color: colors.linkText,
                        alignSelf: 'center'
                    }}>
                    <FontAwesomeIcon icon={viewAll ? faChevronUp : faChevronDown} />
                    &nbsp;
                    {viewAll ? 'View Less' : 'View All Publications'}
                </span>
            </Box>
        </Section>
    );
};

export const PublicationItem = ({ publication }) => (
    <Box direction='column' className='py-2' css={{ lineHeight: 1.8 }}>
        <div>
            <a className='fw-bold' href={publication.pdf} target='_blank' rel="noreferrer">
                {publication.title}
            </a>
        </div>
        <div>
            <span>{publication.date} &middot;&nbsp;</span>
            <span css={{ color: colors.grayText }}>
                {publication.body}
            </span>
        </div>
        <Box gap='xlarge'>
            <a className='text-decoration-none' href={publication.pdf} target='_blank' rel="noreferrer">
                <Box align='center'>
                    Pdf&nbsp;
                    <FontAwesomeIcon size='sm' icon={faArrowUpRightFromSquare} />
                </Box>
            </a>
            {publication.github &&
                <a className='text-decoration-none' href={publication.github} target='_blank' rel="noreferrer">
                    <Box align='center'>
                        Github&nbsp;
                        <FontAwesomeIcon size='sm' icon={faArrowUpRightFromSquare} />
                    </Box>
                </a>}
        </Box>
    </Box>
);
