import React from 'react';
import {Box} from 'boxible';
import styled from '@emotion/styled';
import {colors} from '~/pages/learning-research/theme';
import {Section} from '~/pages/learning-research/components/section';

const Supporter = styled.a({
    display: 'flex',
    alignItems: 'center'
});

const SupporterImage = styled.img({
    width: '100%',
    height: 'auto'
});

export const Funders = () => {
    return (
        <Section>
            <Box direction="column" align={{ mobile: 'center' }} className='py-2 container'>
                <div
                    css={{
                        margin: 'auto'
                    }}>
                    <h3 className="fw-bold align-self-start">Support from Scientific Agencies</h3>
                    <Box justify='center'>
                        <Supporter target="_blank" href="https://ies.ed.gov/">
                            <SupporterImage
                                alt="Institute of Education Sciences logo"
                                src='/dist/images/research/funders/ies-logo.webp' />
                        </Supporter>
                        <Supporter target="_blank" href="https://www.nsf.org/gb/en">
                            <SupporterImage
                                alt="National Science Foundation logo"
                                src='/dist/images/research/funders/nsf-logo.webp' />
                        </Supporter>
                    </Box>

                    <div>
                        <a href="https://openstax.org/foundation" target='_blank' className="mb-2" css={{ color: colors.linkText }} rel="noreferrer">
                            <h5>View Other Philanthropic Supporters</h5>
                        </a>

                        <p className="x-small" css={{ color: colors.grayText }}>
                            *The research reported here was supported by the Institute of Education Sciences,
                            U.S. Department of Education, through Grant R305N210064 to Rice University.
                            The opinions expressed are those of the authors and do not represent views of the
                            Institute or the U.S. Department of Education.
                        </p>
                    </div>
                </div>
            </Box>
        </Section>
    );
};
