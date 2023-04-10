/** @jsx jsx */
import {jsx} from '@emotion/react';
import {useRef, useState} from 'react';
import {Box} from 'boxible';
import styled from '@emotion/styled';
import {colors, media} from '~/pages/research/theme';
import {Section} from '~/pages/research/components/section';
import {TabAccordionCombo} from '~/pages/research/components/tab-accordion-combo';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from '@fortawesome/free-solid-svg-icons/faChevronUp';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import Dialog from '~/components/dialog/dialog';
import {isMobileDisplay} from '~/helpers/device';

const MemberGrid = styled.div({
    display: 'grid',
    gap: '2rem',
    padding: '4rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10em, 1fr))',
    [media.mobile]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(8em, 1fr))',
        gap: '3rem',
        padding: '2rem'
    }
});

const CollaboratorGrid = styled.div({
    display: 'grid',
    gap: '2rem',
    padding: '4rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10em, 1fr))',
    [media.mobile]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(10em, 1fr))',
        gap: '3rem',
        padding: '2rem'
    }
});

const AlumniGrid = styled(Box)({
    flexDirection: 'column',
    padding: '4rem',
    display: 'grid',
    gap: '1rem',
    fontSize: '18px',
    [media.mobile]: {
        textAlign: 'center',
        padding: '2rem',
        display: 'grid',
        gap: '3rem',
        fontSize: '16px'
    }
});

export const MembersSection = ({data: {peopleHeader, currentMembers, collaboratingResearchers, alumni }}) => {
    const [viewAll, setViewAll] = useState(!isMobileDisplay());
    const membersRef = useRef(null);
    const scrollToMembers = () => {
        membersRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const members = viewAll ? currentMembers : currentMembers.slice(0, 4);

    return (
        <Section backgroundColor={colors.lightGrayBackground}>
            <h2 className='pb-2' ref={membersRef}>{peopleHeader}</h2>
            <TabAccordionCombo>
                <div label='Current Members' selected>
                    <MemberGrid>
                        {members.map((member, index) =>
                            <Member
                                member={member}
                                key={index}
                                displayName={member.firstName}
                            />
                        )}
                    </MemberGrid>
                    <p
                        className='py-4 mobile-only'
                        onClick={() => {
                            if (viewAll) {
                                scrollToMembers();
                            }
                            setViewAll(!viewAll);
                        }}
                        css={{
                            cursor: 'pointer',
                            color: colors.linkText,
                            textAlign: 'center'
                        }}
                    >
                        <FontAwesomeIcon icon={viewAll ? faChevronUp : faChevronDown}></FontAwesomeIcon>
                        &nbsp;
                        {viewAll ? 'View Less' : 'View All Current Members'}
                    </p>
                </div>

                <div label='Collaborating Researchers'>
                    <CollaboratorGrid>
                        {collaboratingResearchers.map((member, index) =>
                            <Member
                                member={member}
                                key={index}
                                displayName={`${member.firstName} ${member.lastName}`}
                            />
                        )}
                    </CollaboratorGrid>
                </div>

                <div label='Alumni'>
                    <AlumniGrid>
                        {alumni.map((alumnus, index) =>
                            <Alumnus alumnus={alumnus} key={index} />
                        )}
                    </AlumniGrid>
                </div>
            </TabAccordionCombo>
        </Section>
    );
};

const MemberModal = ({ member, isOpen, onHide }) => {
    return (
        <Dialog className='member-modal' onPutAway={onHide} isOpen={isOpen} closeOnOutsideClick={true}>
            <MemberDetails member={member} />
        </Dialog>
    );
};

export const Member = ({ member, displayName }) => {
    const [show, setShow] = useState(false);

    return (
        <Box direction='column' align='center' className='text-center'>
            <img
                height={145}
                width={145}
                alt={member.photo.title}
                src={member.photo.file}
                tabIndex={0}
                onClick={() => setShow(true)}
            />
            <span
                css={{marginTop: '1.5rem', textAlign: 'center'}}
                className='link-text'
                tabIndex={0}
                onClick={() => setShow(true)}
            >
                {displayName}
            </span>
            <small css={{textAlign: 'center'}}>{member.title}</small>
            <MemberModal member={member} isOpen={show} onHide={() => setShow(false)} />
        </Box>
    );
};

export const MemberDetails = ({ member }) => {
    return (
        <Box
            css={{
                fontSize: 15,
                margin: '20px'
            }}>
            <Box gap='large'>
                <MemberImage className='desktop-only' src={member.photo.file} alt={member.firstName} />
                <Box direction='column' gap='large'>
                    <MemberInfo member={member} />
                    <MemberEducation member={member} />
                    <MemberResearchInterest member={member} />
                    <MemberBio member={member} />
                    <MemberLinks member={member} />
                </Box>
            </Box>
        </Box>
    );
};

const MemberImage = styled.img({
    marginBottom: '.5rem',
    width: 145,
    height: 145,
    [media.mobile]: {
        width: 75,
        height: 75
    }
});

export const MemberInfo = ({ member }) => {
    return (
        <Box align='center' gap='large'>
            <MemberImage className='mobile-only' src={member.photo.file} alt={member.firstName} />
            <Box direction='column'>
                <h4>{member.firstName} {member.lastName}</h4>
                <span css={{ color: colors.grayText }}>
                    {member.longTitle || member.title}
                </span>
            </Box>
        </Box>
    );
};

export const MemberEducation = ({ member }) => {
    if (!member.education) {
        return null;
    }
    return (
        <Box direction='column'>
            <h4>Education</h4>
            <span>
                {member.education}
                <br />
                {member.specialization && <span css={{ color: colors.grayText }}>{member.specialization}</span>}
            </span>
        </Box>
    );
};

export const MemberResearchInterest = ({ member }) => {
    if (!member.researchInterest) {
        return null;
    }
    return (
        <Box direction='column'>
            <h4>Research Interest</h4>
            <span>{member.researchInterest}</span>
        </Box>
    );
};

export const MemberBio = ({ member }) => {
    return (
        <Box direction='column'>
            <h4>Bio</h4>
            <span>{member.bio}</span>
        </Box>
    );
};

export const MemberLinks = ({ member }) => {
    return (
        <Box gap='large'>
            {member.linkedIn && <a href={member.linkedIn} target='_blank' rel="noreferrer">LinkedIn</a>}
            {member.googleScholar && <a href={member.googleScholar} target='_blank' rel="noreferrer">Google Scholar</a>}
            {member.website && <a href={member.website} target='_blank' rel="noreferrer">Website</a>}
        </Box>
    );
};

export const Alumnus = ({ alumnus }) => (
    <Box direction={{ mobile: 'column' }} align='center' justify='center' gap>
        <a css={{ flex: 1 }} href={alumnus.linkedIn} target='_blank' rel="noreferrer">{alumnus.name}</a>
        <span css={{ flex: 3, color: colors.grayText }}>{alumnus.title}</span>
    </Box>
);
