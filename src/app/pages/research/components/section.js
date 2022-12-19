import {colors, media} from '~/pages/research/theme';
import React from 'react';

export const Section = ({ children, backgroundColor= colors.white, padding = true }) => {
    return (
        <div
            css={{
                backgroundColor,
                padding: padding ? '60px 0' : '0',
                [media.mobile]: {
                    padding: padding ? '50px 0' : '0'
                }
            }}>
            <div className='content'>
                {children}
            </div>
        </div>
    );
};
