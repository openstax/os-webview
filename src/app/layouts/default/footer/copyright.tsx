import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';

type Props = {
    copyright: string | undefined;
    apStatement: string | undefined;
}

export default function Copyright({copyright, apStatement}: Props) {
    const updatedCopyright = copyright
        ? copyright.replace(/-\d+/, `-${new Date().getFullYear()}`)
        : copyright;

    return (
        <React.Fragment>
            <RawHTML html={updatedCopyright} />
            <RawHTML Tag="ap-html" html={apStatement} />
        </React.Fragment>
    );
}
