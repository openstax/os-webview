import React from 'react';
import {colors, media} from '../theme';
import styled from '@emotion/styled';
import {Box} from 'boxible';
import {Section} from '~/pages/learning-research/components/section';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';

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
                    src='/dist/images/learning-research/banner-image.png'
                    alt='banner-image' css={{ flex: 2 }}
                />
            </Box>
        </Section>
    );
};

export const Banner = ({data: {bannerBody, bannerHeader, bannerCTA, bannerURL}}) => {
    if (!bannerBody) {return null;}
    return (
        <Section padding={false} css={{backgroundColor: colors.lightTeal}}>
            <Box align={{mobile: 'center'}} direction={{mobile: 'column'}} padding={{vertical: 'large'}} gap='medium'>
                <h4 css={{color: colors.blackText, flex: 1}}>
                    {bannerHeader}
                </h4>
                <Box direction='column' flex={{grow: 3}}>
                    <span>{bannerBody}</span>
                    {(bannerCTA && bannerURL) && <a
                        className='text-decoration-none' href={bannerURL}
                        target='_blank' rel="noreferrer">
                        <Box align='center' gap>
                            <span>{bannerCTA}</span>
                            <FontAwesomeIcon size='sm' icon={faArrowUpRightFromSquare} />
                        </Box>
                    </a>}
                </Box>
            </Box>
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="separator" />
        </Section>
    );
};

