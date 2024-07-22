import React from 'react';
import { LoadedPage } from '~/components/jsx-helpers/loader-page';
import { Data } from '~/helpers/use-page-data';
import { ContentBlocks, ContentBlockConfig } from './blocks/ContentBlock';

function FlexPageBody({data}: {data: Data}) {
    return <ContentBlocks data={data.body as ContentBlockConfig[]} />;
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
