import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';

type PromoteData = {
    content?: {
        description: string;
    }
}

export default function Promo({promoteSnippet}: {promoteSnippet: PromoteData | PromoteData[]}) {
    // promoteSnippet may or may not be in an array
    const obj = promoteSnippet;
    const data = obj instanceof Array ? obj[0] : obj;

    if (!data?.content) {
        return null;
    }

    return (
        <RawHTML html={data.content.description} />
    );
}
