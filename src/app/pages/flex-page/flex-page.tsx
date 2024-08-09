import React from 'react';
import { LoadedPage } from '~/components/jsx-helpers/loader-page';
import { ContentBlocks, ContentBlockConfig } from './blocks/ContentBlock';

type Data = {
    body: ContentBlockConfig[];
}

function FlexPageBody({data}: {data: Data}) {
    return <ContentBlocks data={data.body} />;
}

export default function FlexPage({data}: {data: Data}) {
    return <main className="flex-page page">
        <LoadedPage
            data={data}
            Child={FlexPageBody}
            doDocumentSetup
            noCamelCase={true}
            props={{}}
        />
    </main>;
}
