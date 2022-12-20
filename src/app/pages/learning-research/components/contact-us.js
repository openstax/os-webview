import React from 'react';
import {Box} from 'boxible';
import {colors, media} from '~/pages/learning-research/theme';
import {Section} from '~/pages/learning-research/components/section';

export const ContactUs = () => (
    <Section backgroundColor={colors.lightTeal} padding={false}>
        <Box className='py-3' direction={{ mobile: 'column' }} align='center' gap='xlarge'>
            <h3>Connect with our Research Team</h3>
            <a
                className="btn btn-orange"
                css={{
                    alignSelf: 'end',
                    [media.mobile]: {
                        alignSelf: 'center'
                    }
                }}
                target='_blank'
                href='https://riceuniversity.co1.qualtrics.com/jfe/form/SV_6EbRsmpDb2Hs69w?jfefe=new' rel="noreferrer">
                Contact Us
            </a>
        </Box>
    </Section>
);
