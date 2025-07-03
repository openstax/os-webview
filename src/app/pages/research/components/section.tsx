/** @jsx jsx */
import {jsx} from '@emotion/react';
import {colors, media} from '~/pages/research/theme';

export const Section = ({
    children,
    backgroundColor = colors.white,
    padding = true
}: React.PropsWithChildren<{
    backgroundColor?: string;
    padding?: boolean;
}>) => {
    return (
        <div
            css={{
                backgroundColor,
                padding: padding ? '60px 0' : '0',
                [media.mobile]: {
                    padding: padding ? '50px 0' : '0'
                }
            }}
        >
            <div className="content">{children}</div>
        </div>
    );
};
