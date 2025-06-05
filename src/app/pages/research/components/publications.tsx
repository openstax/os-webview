/** @jsx jsx */
import {jsx} from '@emotion/react';
import {useRef, useState} from 'react';
import {Box} from 'boxible';
import {isMobileDisplay} from '~/helpers/device';
import {Section} from '~/pages/research/components/section';
import {colors} from '~/pages/research/theme';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';

type Publication = {
    pdf: string;
    title: string;
    date: string;
    authors: string;
    excerpt: string;
    github?: string;
}

export const Publications = ({data: {publicationHeader, publications}}: {
    data: {
        publicationHeader: string;
        publications: Publication[];
    }
}) => {
    const [viewAll, setViewAll] = useState(false);
    const initialCount = isMobileDisplay() ? 3 : 5;
    const publicationList = viewAll ? publications : publications.slice(0, initialCount);

    const publicationsRef = useRef<HTMLDivElement>(null);
    const scrollToPublications = () => {
        publicationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Section>
            <Box direction='column' ref={publicationsRef}>
                <h2>{publicationHeader}</h2>
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

const PublicationItem = ({ publication }: {publication: Publication}) => (
    <Box direction='column' padding={{vertical: 'large'}} css={{ lineHeight: 1.8 }}>
        <div>
            <a className='large-link' href={publication.pdf} target='_blank' rel="noreferrer">
                {publication.title}
            </a>
        </div>
        <div>
            <span>{publication.date} &middot;&nbsp;</span>
            <span css={{ color: colors.grayText }}>
                {publication.authors} {publication.excerpt}
            </span>
        </div>
        <Box gap='xlarge'>
            <a className='text-decoration-none' href={publication.pdf} target='_blank' rel="noreferrer">
                <Box align='center' gap>
                    <span>Pdf</span>
                    <FontAwesomeIcon size='sm' icon={faArrowUpRightFromSquare} />
                </Box>
            </a>
            {publication.github &&
                <a className='text-decoration-none' href={publication.github} target='_blank' rel="noreferrer">
                    <Box align='center' gap>
                        <span>Github</span>
                        <FontAwesomeIcon size='sm' icon={faArrowUpRightFromSquare} />
                    </Box>
                </a>}
        </Box>
    </Box>
);
