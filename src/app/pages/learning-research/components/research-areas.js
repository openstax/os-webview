import React from 'react';
import {Section} from '~/pages/learning-research/components/section';
import {colors, media} from '~/pages/learning-research/theme';
import styled from '@emotion/styled';
import {Box} from 'boxible';
import {TabAccordionCombo} from '~/pages/learning-research/components/tab-accordion-combo';
import RawHTML from '~/components/jsx-helpers/raw-html';

export const ResearchSection = ({data: {researchAreasList, researchAreaHeader, researchAreaDescription}}) => {
    return (
        <Section backgroundColor={colors.lightGrayBackground}>
            <h2>{researchAreaHeader}</h2>
            <p className='mobile-only'>
                {researchAreaDescription}
            </p>
            <ResearchFocusAreas researchAreaList={researchAreasList} />
        </Section>
    );
};

export const ResearchFocusAreas = ({researchAreaList}) => {
    console.log(researchAreaList);
    return (
        <TabAccordionCombo css={{backgroundColor: colors.lightGrayBackground}}>
            {researchAreaList.map((researchArea, i) => {
                return (
                    <div label={researchArea.researchAreaTitle} selected className='py-2' key={i}>
                        <RawHTML className='mobile-only' html={researchArea.researchAreaBlurbMobile} />
                        <RawHTML className='desktop-only' html={researchArea.researchAreaBlurb} />
                        {researchArea.researchAreas.map((areaSection, j) => (
                            <ResearchFocusArea
                                isLast={researchArea.researchAreas.length === j + 1}
                                researchArea={areaSection}
                                key={j}
                            />
                        ))}
                    </div>
                );
            })}
        </TabAccordionCombo>
    );
};

export const ResearchFocusArea = ({ researchArea, isLast }) => (
    <div>
        <Box gap='xlarge' direction={{ mobile: 'column' }} className='py-2'>
            <ResearchAreaImage src={researchArea.photo.file} alt={researchArea.photo.title} />
            <Box direction='column' css={{ flex: 6 }}>
                <h4>{researchArea.header}</h4>
                <RawHTML className='desktop-only' html={researchArea.description} />
                <RawHTML className='mobile-only' html={researchArea.shortDescription} />
                {researchArea.ctaLink &&
                    <div>
                        <a href={researchArea.ctaLink} target='_blank' rel="noreferrer">
                            {researchArea.ctaText}
                        </a>
                    </div>}
            </Box>
        </Box>
        {!isLast && <hr />}
    </div>
);

const ResearchAreaImage = styled.img({
    flex: 2,
    maxWidth: 250,
    height: '100%',
    [media.mobile]: {
        alignSelf: 'center'
    }
});
