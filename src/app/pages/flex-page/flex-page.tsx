import React from 'react';
import {LoadedPage} from '~/components/jsx-helpers/loader-page';
import useLayoutContext, {LayoutName} from '~/contexts/layout';
import {ContentBlockRoot, BlockData} from '@openstax/flex-page-renderer/ContentBlockRoot';
import {blockMap} from './block-map';
import usePortalContext from '~/contexts/portal';
import {assertNotNull} from '~/helpers/data';
import './flex-page.scss';

export type FlexPageData = {
    meta?: {type: string};
    layout: [{type: LayoutName}?];
    body: BlockData<typeof blockMap>;
    schoolData: null | {
        industry: string
    }
};

export const isFlexPage = (data?: {meta?: FlexPageData['meta']}) =>
    typeof data?.meta?.type === 'string' &&
    ['pages.FlexPage', 'pages.RootPage'].includes(data.meta.type);

function FlexPageBody({data}: {data: FlexPageData}) {
    return <ContentBlockRoot data={data.body} blocks={blockMap} />;
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
    const ref = React.useRef<HTMLElement>(null);
    const {rewriteLinks} = usePortalContext();

    React.useLayoutEffect(() => {
        rewriteLinks(assertNotNull(ref.current));
    }, [data, rewriteLinks]);

    return (
        <main className="flex-page page flex-structure-container" ref={ref}>
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
