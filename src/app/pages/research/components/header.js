import React from 'react';
import {colors, media} from '~/pages/research/theme';
import styled from '@emotion/styled';
import {Box} from 'boxible';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Section} from '~/pages/research/components/section';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';

export const HeaderImage = styled.img({
    width: '35%',
    [media.mobile]: {
        width: '85%'
    },
    [media.tablet]: {
        width: '60%'
    }
});

export const Header = ({data: { missionBody }}) => {
    return (
        <Section backgroundColor={colors.lightBlue}>
            <Box direction={{ mobile: 'column', tablet: 'column', desktop: 'row' }} align='center'>
                <h1 css={{ color: colors.white, flex: 5 }} className='fw-bolder'>
                    {missionBody}
                </h1>
                <HeaderImage
                    src='/dist/images/research/landing/banner-image.png'
                    alt='banner-image' css={{ flex: 2 }}
                />
            </Box>
        </Section>
    );
};

export const Banner = () => (
    <div css={{ backgroundColor: colors.lightTeal }}>
        <Box direction={{ mobile: 'column' }} className='container align-items-center py-2' gap='medium'>
            <h4 css={{ color: colors.blackText, flex: 1 }}>
                Calling all learning researchers!
            </h4>
            <Box align={{ mobile: 'center' }} className='justify-content-center' direction='column' css={{ flex: 4 }}>
                <span>Learn about the research workflow on OpenStax Kinetic during office hours hosted with IES!</span>
                <a className='text-decoration-none' href='https://ies.ed.gov/funding/technicalassistance.asp' target='_blank' rel="noreferrer">
                    <Box align='center'>
                        IES Office Hours
                        &nbsp;
                        <FontAwesomeIcon size='sm' icon={faArrowUpRightFromSquare} />
                    </Box>
                </a>
            </Box>
        </Box>
        <OXColoredStripe />
    </div>
);

export const OXColoredStripe = () => (
    <Box css={{ height: 10 }}>
        <span
            css={{
                backgroundColor: colors.orange,
                flex: 3.5
            }}></span>
        <span
            css={{
                backgroundColor: colors.primaryBlue,
                flex: 1.5
            }}></span>
        <span
            css={{
                backgroundColor: colors.red,
                flex: 1
            }}></span>
        <span
            css={{
                backgroundColor: colors.yellow,
                flex: 2.5
            }}></span>
        <span
            css={{
                backgroundColor: colors.lightBlue,
                flex: 1.5
            }}></span>
    </Box>
);
