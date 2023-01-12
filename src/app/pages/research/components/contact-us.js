import React from 'react';
import {Box} from 'boxible';
import {colors, media} from '~/pages/research/theme';
import {Section} from '~/pages/research/components/section';

export const ContactUs = () => (
    <Section backgroundColor={colors.lightTeal} padding={false}>
        <Box
            padding={{ vertical: 'xlarge' }}
            direction={{ mobile: 'column' }}
            align={{ desktop: 'center' }}
            gap='xlarge'
        >
            <h3>Connect with our Research Team</h3>
            <a
                className="btn btn-orange"
                css={{
                    borderRadius: 5,
                    width: 140,
                    alignSelf: 'end',
                    [media.mobile]: {
                        alignSelf: 'start'
                    }
                }}
                target='_blank'
                href='https://riceuniversity.co1.qualtrics.com/jfe/form/SV_6EbRsmpDb2Hs69w?jfefe=new' rel="noreferrer">
                Contact Us
            </a>
        </Box>
    </Section>
);
