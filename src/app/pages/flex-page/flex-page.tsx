import React from 'react';
import {LoadedPage} from '~/components/jsx-helpers/loader-page';
import useLayoutContext, {LayoutName} from '~/contexts/layout';
import {ContentBlocks, ContentBlockConfig} from './blocks/ContentBlock';
import './flex-page.scss';

export type FlexPageData = {
    meta?: {type: string};
    layout: [{type: LayoutName}?];
    body: ContentBlockConfig[];
};

export const isFlexPage = (data?: {meta?: FlexPageData['meta']}) =>
    typeof data?.meta?.type === 'string' &&
    ['pages.FlexPage', 'pages.RootPage'].includes(data.meta.type);

function FlexPageBody({data}: {data: FlexPageData}) {
    return <ContentBlocks data={data.body} />;
}

function warnAndUseDefault() {
    console.warn('No layout set for page');
    return 'default' as LayoutName;
}

export function LayoutUsingData({
    data,
    children
}: {
    data: FlexPageData;
    children: React.ReactNode;
}) {
    const {layoutParameters, setLayoutParameters} = useLayoutContext();
    const layoutName = data.layout[0]?.type || warnAndUseDefault();

    if (layoutParameters.name !== layoutName) {
        setLayoutParameters({
            data,
            name: layoutName
        });
        return null;
    }
    return children;
}

export default function FlexPage({data}: {data: FlexPageData}) {
    return (
        <main className="flex-page page">
            <LoadedPage
                data={data}
                Child={FlexPageBody}
                doDocumentSetup
                noCamelCase={true}
                props={{}}
            />
        </main>
    );
}
