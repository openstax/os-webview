import {SIZES} from 'boxible';

export const colors = {
    pageBackground: '#f7f8fa',
    lightGrayBackground: '#F1F1F1',
    orange: '#F36B32',
    primaryButton: '#D4450C',
    lightBlue: '#0DC0DC',
    darkBlue: '#151B2C',
    primaryBlue: '#002469',
    red: '#ca2026',
    teal: '#0dc0de',
    lightTeal: '#DBF3F8',
    darkTeal: '#039AC4',
    purple: '#6922EA',
    gray: '#E8E8E8',
    green: '#0EE094',
    yellow: '#F4D019',
    lightGray: '#DBDBDB',
    darkGray: '#989898',
    text: '#212529',
    grayText: '#848484',
    darkText: '#151B2C',
    blackText: '#424242',
    input: { border: '#ced4da' },
    line: '#cfcfcf',
    linkText: '#026AA1',
    linkButtonIcon: '#DBDBDB',
    linkButtonIconHover: '#151B2C',
    white: '#ffffff',
    transparent: 'rgba(0,0,0,0)'
};

const scaleFactor = 10/16;
const medium = scaleFactor * 96;
const large = scaleFactor * 120;

export const media = {
    mobile: `@media (max-width: ${medium}em)`,
    tablet: `@media (min-width: ${medium}em) and (max-width: ${large}em)`,
    desktop: `@media (min-width: ${large}em)`
};

SIZES.medium = '1rem';
SIZES.large = '2rem';
SIZES.xlarge = '3rem';
SIZES.xxlarge = '4rem';
