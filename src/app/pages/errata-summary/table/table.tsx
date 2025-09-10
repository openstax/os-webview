import React, {useState} from 'react';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import {getDisplayStatus, Errata} from '~/helpers/errata';
import './table.scss';

type ProcessedErrataItem = {
    date: string;
    source: string;
    displayStatus: string;
    barStatus: string;
    errorType: string;
    id: string;
    location: string;
    detail: string;
    modified: string;
};

type SortController = ReturnType<typeof useSortController>;

type DesktopHeaderColumnProps = {
    colSpec: ColumnSpec;
    sortController: SortController;
};

type DesktopHeaderRowProps = {
    sortController: SortController;
};

type DesktopDataColumnProps = {
    colSpec: ColumnSpec;
    entry: ProcessedErrataItem;
};

type DesktopDataRowProps = {
    entry: ProcessedErrataItem;
};

type DesktopTableProps = {
    data: ProcessedErrataItem[];
};

type MobileRowProps = {
    entry: ProcessedErrataItem;
    label: string;
    columnId: string;
};

type MobileTableProps = {
    entry: ProcessedErrataItem;
};

type MobileTablesProps = {
    data: ProcessedErrataItem[];
};

type TableProps = {
    data: Errata[];
    filter: string;
};

type ColumnSpec = typeof columnSpecs[number];

const columnSpecs = [
    {
        label: 'Date Submitted',
        id: 'date',
        sortFn: 'sortDate',
        cssClass: 'mid'
    },
    {
        label: 'ID',
        id: 'id',
        sortFn: 'sortNumber',
        cssClass: 'narrow'
    },
    {
        label: 'Source',
        id: 'source',
        sortFn: 'sort',
        cssClass: 'mid'
    },
    {
        label: 'Error Type',
        id: 'errorType',
        sortFn: 'sort',
        cssClass: 'mid'
    },
    {
        label: 'Location',
        id: 'location',
        cssClass: 'mid-wide'
    },
    {
        label: 'Description',
        id: 'detail',
        cssClass: ''
    },
    {
        label: 'Decision',
        id: 'displayStatus',
        sortFn: 'sortDecision',
        cssClass: 'mid'
    }
] as const;

const statusSortOrder: {[key: string]: number} = {
    'Co': 1,
    'Wi': 2,
    'No': 3,
    'Du': 4,
    'In': 5
};

const sortFunctions = {
    sortDate: (a: string, b: string): number => new Date(a).getTime() - new Date(b).getTime(),
    sort: (a: string | null, b: string | null): number => {
        const as = a === null ? '' : a;
        const bs = b === null ? '' : b;

        return as.localeCompare(bs, 'en', {sensitivity: 'base'});
    },
    sortNumber: (a: number | string, b: number | string): number => Number(a) - Number(b),
    sortDecision: (a: ProcessedErrataItem, b: ProcessedErrataItem): number => {
        const ar = statusSortOrder[a.displayStatus.substr(0, 2)] || 6;
        const br = statusSortOrder[b.displayStatus.substr(0, 2)] || 6;

        if (ar !== br) {
            return br - ar;
        }
        const ad = new Date(a.modified).valueOf();
        const bd = new Date(b.modified).valueOf();

        return bd - ad;
    }
};

function DesktopHeaderColumn({colSpec, sortController}: DesktopHeaderColumnProps): React.ReactElement {
    const {sortKey, sortDir, setSortFn, setSortDir, setSortKey} = sortController;
    const sortable = 'sortFn' in colSpec;
    const onClick = (): void => {
        if (sortKey === colSpec.id) {
            setSortDir(-sortDir);
        } else {
            if (sortable) {
                setSortFn(colSpec.sortFn);
            }
            setSortKey(colSpec.id);
            setSortDir(1);
        }
    };
    const sortAttributes = sortable ? {
        role: 'button', tabIndex: 0, onClick, onKeyDown: treatSpaceOrEnterAsClick
    } : {};
    const sortIndicator = sortable ?
        <span className={`will-sort sortdir${colSpec.sortFn === 'sort' ? 1 : -1}`} /> :
        null;

    return (
        <th
            key={colSpec.id}
            className={colSpec.cssClass}
            {...sortAttributes}
        >
            {colSpec.label}
            {
                sortKey === colSpec.id ?
                    <span className={`sortdir${sortDir}`} /> :
                    sortIndicator
            }
        </th>
    );
}

function DesktopHeaderRow({sortController}: DesktopHeaderRowProps): React.ReactElement {
    return (
        <tr>
            {
                columnSpecs.map((colSpec) =>
                    <DesktopHeaderColumn key={colSpec.id} colSpec={colSpec} sortController={sortController} />
                )
            }
        </tr>
    );
}

function DesktopDataColumn({colSpec, entry}: DesktopDataColumnProps): React.ReactElement {
    return (
        <td>
            <div className={colSpec.cssClass}>
                {
                    colSpec.id === 'id' ?
                        <a href={entry[colSpec.id as keyof ProcessedErrataItem] as string}>
                            {entry[colSpec.id as keyof ProcessedErrataItem] || ''}
                        </a> :
                        <React.Fragment>
                            {entry[colSpec.id as keyof ProcessedErrataItem]}{' '}
                            {
                                colSpec.id === 'displayStatus' &&
                                entry[colSpec.id as keyof ProcessedErrataItem] === 'No Correction' &&
                                    <a href={`/errata/${entry.id}`}>Details</a>
                            }
                        </React.Fragment>
                }
            </div>
        </td>
    );
}

function DesktopDataRow({entry}: DesktopDataRowProps): React.ReactElement {
    return (
        <tr>
            {columnSpecs.map((colSpec) =>
                <DesktopDataColumn key={colSpec.id} colSpec={colSpec} entry={entry} />
            )}
        </tr>
    );
}

function useSortController() {
    const [sortFn, setSortFn] = useState<keyof typeof sortFunctions>('sortDate');
    const [sortKey, setSortKey] = useState<keyof ProcessedErrataItem>('date');
    const [sortDir, setSortDir] = useState<number>(-1);

    return {sortFn, sortKey, sortDir, setSortFn, setSortKey, setSortDir};
}

function DesktopTable({data}: DesktopTableProps): React.ReactElement {
    const sortController = useSortController();
    const {sortFn, sortKey, sortDir} = sortController;

    const sortedData = [...data] as Array<string & ProcessedErrataItem>;

    sortedData.sort((a, b) =>
        // @ts-expect-error sortKey and sortFn are guaranteed compatible
        sortFunctions[sortFn](a[sortKey], b[sortKey])
    );
    if (sortDir < 0) {
        sortedData.reverse();
    }

    return (
        <table className="body-block summary-table">
            <thead>
                <DesktopHeaderRow sortController={sortController} />
            </thead>
            <tbody>
                {sortedData.map((entry: ProcessedErrataItem) => <DesktopDataRow key={entry.id} entry={entry} />)}
            </tbody>
        </table>
    );
}

function MobileRow({entry, label, columnId}: MobileRowProps): React.ReactElement {
    return (
        <tr>
            <th>{label}</th>
            <td>
                <div>
                    {
                        columnId === 'id' ?
                            <a href={entry[columnId as keyof ProcessedErrataItem] as string}>
                                {entry[columnId as keyof ProcessedErrataItem] || ''}
                            </a> :
                            (entry[columnId as keyof ProcessedErrataItem] || '')
                    }
                </div>
            </td>
        </tr>
    );
}

function MobileTable({entry}: MobileTableProps): React.ReactElement {
    return (
        <table className="body-block summary-table-mobile">
            <tbody>
                {
                    columnSpecs.map((colSpec) =>
                        <MobileRow
                            key={colSpec.label}
                            entry={entry}
                            label={colSpec.label}
                            columnId={colSpec.id}
                        />
                    )
                }
            </tbody>
        </table>
    );
}

function MobileTables({data}: MobileTablesProps): React.ReactElement {
    return (
        <>
            {data.map((entry: ProcessedErrataItem) => <MobileTable entry={entry} key={entry.id} />)}
        </>
    );
}

function matchesFilter(filter: string, item: ProcessedErrataItem): boolean {
    const status = item.displayStatus;

    switch (filter) {
    case '':
        return true;
    case 'in-review':
        return status === 'In Review';
    case 'reviewed':
        return (/Reviewed|Will Correct|No Correction/).test(status);
    default:
        return (/^Corrected/).test(status);
    }
}

export default function Table({data, filter}: TableProps): React.ReactElement {
    const details: ProcessedErrataItem[] = React.useMemo(
        () => data.map(
            (item: Errata): ProcessedErrataItem => {
                const displayStatus = getDisplayStatus(item);

                return {
                    date: new Date(item.created).toLocaleDateString(),
                    source: item.resource === 'Other' ? item.resourceOther || '' : item.resource,
                    displayStatus: displayStatus.status,
                    barStatus: displayStatus.barStatus,
                    errorType: item.errorType === 'Other' ? item.errorTypeOther || '' : item.errorType,
                    id: item.id,
                    location: [item.location, item.additionalLocationInformation]
                        .filter((loc) => loc).join('; '),
                    detail: item.detail,
                    modified: item.modified
                };
            }
        ).sort((a: ProcessedErrataItem, b: ProcessedErrataItem) => Number(b.id) - Number(a.id)),
        [data]
    );
    const filteredDetails: ProcessedErrataItem[] = React.useMemo(
        () => details.filter((item: ProcessedErrataItem) => matchesFilter(filter, item)),
        [details, filter]
    );

    return (
        <div className="boxed">
            <MobileTables data={filteredDetails} />
            <DesktopTable data={filteredDetails} />
        </div>
    );
}
