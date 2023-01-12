import React from 'react';
import {Box} from 'boxible';
import styled from '@emotion/styled';
import {Section} from '~/pages/research/components/section';
import {colors, media} from '~/pages/research/theme';
import {TabAccordionCombo} from '~/pages/research/components/tab-accordion-combo';
import RawHTML from '~/components/jsx-helpers/raw-html';

export const ResearchSection = ({data: {researchAreasList, researchAreaHeader, researchAreaDescriptionMobile}}) => {
    return (
        <Section backgroundColor={colors.lightGrayBackground}>
            <h2>{researchAreaHeader}</h2>
            <RawHTML html={researchAreaDescriptionMobile} className='mobile-only' />
            <ResearchFocusAreas researchAreaList={researchAreasList} />
        </Section>
    );
};

export const ResearchFocusAreas = ({researchAreaList}) => {
    return (
        <TabAccordionCombo collapseAll={true}>
            {researchAreaList.map((researchArea, i) => {
                return (
                    <Box
                        direction='column'
                        label={researchArea.researchAreaTitle}
                        selected
                        padding={{vertical: 'large'}}
                        key={i}
                    >
                        <RawHTML className='mobile-only' html={researchArea.researchAreaBlurbMobile} />
                        <RawHTML className='desktop-only' html={researchArea.researchAreaBlurb} />
                        {researchArea.researchAreas.map((areaSection, j) => (
                            <ResearchFocusArea
                                isLast={researchArea.researchAreas.length === j + 1}
                                researchArea={areaSection}
                                key={j}
                            />
                        ))}
                    </Box>
                );
            })}
        </TabAccordionCombo>
    );
};

export const ResearchFocusArea = ({ researchArea, isLast }) => (
    <div>
        <Box gap='xlarge' direction={{ mobile: 'column' }} padding={{vertical: 'xlarge'}}>
            <ResearchAreaImage src={researchArea.photo.file} alt={researchArea.photo.title} />
            <Box direction='column' gap='large' css={{ flex: 6 }}>
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
