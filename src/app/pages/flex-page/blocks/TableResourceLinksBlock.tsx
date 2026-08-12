import React from 'react';
import {useIntl} from 'react-intl';
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import type {ConfigMetadata} from '@openstax/flex-page-renderer/ContentBlockContext';
import useUserContext from '~/contexts/user';
import {
    TableBlockConfig,
    findResourceRefs,
    patchTableData,
    useResourcesBySlug
} from './table-resource-links-utils';

type TableDelegateModule = {
    Component: React.ComponentType<{data: TableBlockConfig}>;
    config: ConfigMetadata<'table'>;
};

// @openstax/flex-page-renderer doesn't export a `table` block yet in the
// version this app currently pins - the table block landed in the renderer
// after 1.1.19 (see flex-pages renderer v1.1.21+), and bumping this app's
// dependency is an intentionally separate change from this wrapper. Cast
// narrowly instead of asserting: `blocks.table` is simply absent today, so
// `tableDelegate` is `undefined` and block-map.ts leaves `table` unregistered
// (identical to today's behavior - table blocks don't render at all yet).
// The moment the dependency bumps, `blocks.table` exists, this activates with
// no code change here.
export const tableDelegate = (blocks as unknown as {table?: TableDelegateModule}).table;

// Wraps the renderer's table block so that, client-side, cells carrying a
// `resource_ref` marker (an access-locked instructor/student resource the CMS
// couldn't resolve server-side - its output is cached with no cookie
// variance) resolve to the same states the book detail page's resource boxes
// use. Delegates every bit of sorting/filtering/striping/etc. to the real
// TableBlock; this component only ever patches `text`/`target` on marked
// cells.
export function TableResourceLinksBlock({data}: {data: TableBlockConfig}): React.ReactElement | null {
    const refs = React.useMemo(() => findResourceRefs(data), [data]);
    const slugs = React.useMemo(
        () => Array.from(new Set(refs.map(({ref}) => ref.book_slug))),
        [refs]
    );
    const {userStatus, isVerified} = useUserContext();
    const intl = useIntl();
    const resourcesBySlug = useResourcesBySlug(slugs, isVerified);
    const Delegate = tableDelegate?.Component;

    // Only reachable if this ever renders before the renderer bump lands -
    // block-map.ts only registers this component once `tableDelegate` (and
    // so `Delegate`) exists.
    if (!Delegate) {
        return null;
    }

    // No resource_ref cells: render the delegate immediately with the
    // original data, no fetch, no behavior change. This is the common case -
    // most tables have no markers.
    if (!refs.length) {
        return <Delegate data={data} />;
    }

    const patched = patchTableData(data, refs, {
        resourcesBySlug,
        userStatus,
        loginToUnlockText: intl.formatMessage({id: 'resources.loginToUnlock'})
    });

    return <Delegate data={patched} />;
}
