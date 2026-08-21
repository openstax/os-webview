import React from 'react';
import * as blocks from '@openstax/flex-page-renderer/blocks/index';
import {TableCellContext, type TableCellRenderer} from '@openstax/flex-page-renderer/TableCellContext';
import useUserContext from '~/contexts/user';
import {
    findResourceRefs,
    useResourceRefResolutions,
    type TableBlockConfig,
    type ResourceRefResolution
} from './table-resource-links-utils';
import {TableResourceCell} from './TableResourceCell';

const Delegate = blocks.table.Component;

// Wraps the renderer's table block through its TableCellContext render slot
// so cells carrying a resource_ref marker (an access-locked instructor/
// student resource the CMS couldn't resolve server-side - its output is
// CloudFront-cached with no cookie variance) render the real resource-box
// button - Give dialog and trackLink included - instead of the CMS's static
// fallback link. The block data itself is never patched or cloned; only the
// specific cells this claims get custom content, everything else (sorting,
// filtering, striping, row limits, and every other cell) stays exactly the
// delegate's own behavior.
export function TableResourceLinksBlock({data}: {data: TableBlockConfig}): React.ReactElement {
    const refs = React.useMemo(() => findResourceRefs(data), [data]);
    // Safe to call even when refs is empty: useResourceRefResolutions's
    // underlying fetch effect no-ops (no slugs, no request) with nothing to
    // resolve.
    const resolutions = useResourceRefResolutions(refs);
    const {userStatus} = useUserContext();

    const resolutionByPosition = React.useMemo(() => {
        const map = new Map<string, ResourceRefResolution>();

        resolutions.forEach((r) => map.set(`${r.rowIndex}:${r.cellIndex}`, r));
        return map;
    }, [resolutions]);

    const renderCell = React.useCallback<TableCellRenderer>((_cell, position) => {
        const resolution = resolutionByPosition.get(`${position.rowIndex}:${position.columnIndex}`);

        // Not one of ours, still loading, or no resource matched the
        // heading: fall through to the delegate's own default rendering.
        // The cell data was never patched, so the CMS's own fallback CTA
        // ("View on book page") is still right there - no flicker, no
        // empty cell, no dead end while a real answer isn't ready yet.
        if (resolution?.status !== 'resolved') {
            return undefined;
        }

        return <TableResourceCell resolution={resolution} userStatus={userStatus} />;
    }, [resolutionByPosition, userStatus]);

    // No markers: skip the provider entirely (not just supply a no-op
    // renderer) and hand the original data straight to the delegate. This is
    // the common case - most tables have no markers - and it stays a fetch-
    // free, byte-for-byte passthrough.
    if (!refs.length) {
        return <Delegate data={data} />;
    }

    return (
        <TableCellContext.Provider value={renderCell}>
            <Delegate data={data} />
        </TableCellContext.Provider>
    );
}
