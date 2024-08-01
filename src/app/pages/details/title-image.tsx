import React from 'react';
import useDetailsContext from './context';
import cn from 'classnames';

export default function TitleImage() {
    const {reverseGradient, title, titleImageUrl} = useDetailsContext();
    // const titleLogo = ''; // For future use

    if (!title || !titleImageUrl) {
        return null;
    }

    return (
        <div className={cn('hero', {'reverse-gradient': reverseGradient})}>
            <div className='content book-title'>
                <h1 className='image-heading'>
                    <img
                        className='title-image'
                        src={titleImageUrl}
                        alt={title}
                        height='130'
                        width='392'
                    />
                    {/*
                        titleLogo && (
                            <img className='title-logo' src={titleLogo} alt='' />
                        )
                    */}
                </h1>
            </div>
        </div>
    );
}
