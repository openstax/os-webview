import React, {useState} from 'react';
import $ from '~/helpers/$';
import {getDisplayStatus} from '~/helpers/errata';
import './table.css'; // ?? wasn't used before ??

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
];
const statusSortOrder = {
    'Co': 1,
    'Wi': 2,
    'No': 3,
    'Du': 4,
    'In': 5
};
const sortFunctions = {
    sortDate: (a, b) => new Date(a) - new Date(b),
    sort: (a, b) => {
        const as = a === null ? '' : a;
        const bs = b === null ? '' : b;

        return as.localeCompare(bs, 'en', {sensitivity: 'base'});
    },
    sortNumber: (a, b) => a - b,
    sortDecision: (a, b) => {
        const ar = statusSortOrder[a.substr(0, 2)] || 6;
        const br = statusSortOrder[b.substr(0, 2)] || 6;

        if (ar !== br) {
            return br - ar;
        }
        const ad = new Date(a.modified).valueOf();
        const bd = new Date(b.modified).valueOf();

        return bd - ad;
    }
};

function DesktopHeaderColumn({colSpec, sortController}) {
    const {sortKey, sortDir, setSortFn, setSortDir, setSortKey} = sortController;
    const onClick = (event) => {
        if (sortKey === colSpec.id) {
            setSortDir(-sortDir);
        } else {
            setSortFn(colSpec.sortFn);
            setSortKey(colSpec.id);
            setSortDir(1);
        }
    };
    const sortAttributes = colSpec.sortFn ? {
        role: 'button', tabIndex: 0, onClick, onKeyDown: $.treatSpaceOrEnterAsClick
    } : {};
    const sortIndicator = colSpec.sortFn ?
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

function DesktopHeaderRow({sortController}) {
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

function DesktopDataColumn({colSpec, entry}) {
    return (
        <td>
            <div className={colSpec.cssClass}>
                {
                    colSpec.id === 'id' ?
                        <a href={entry[colSpec.id]}>{entry[colSpec.id] || ''}</a> :
                        <React.Fragment>
                            {entry[colSpec.id]}{' '}
                            {
                                colSpec.id === 'displayStatus' && entry[colSpec.id] === 'No Correction' &&
                                    <a href={`/errata/${entry.id}`}>Details</a>
                            }
                        </React.Fragment>
                }
            </div>
        </td>
    );
}

function DesktopDataRow({entry}) {
    return (
        <tr>
            {columnSpecs.map((colSpec) => <DesktopDataColumn key={colSpec.id} colSpec={colSpec} entry={entry} />)}
        </tr>
    );
}

function useSortController() {
    const [sortFn, setSortFn] = useState('sortDate');
    const [sortKey, setSortKey] = useState('date');
    const [sortDir, setSortDir] = useState(-1);

    return {sortFn, sortKey, sortDir, setSortFn, setSortKey, setSortDir};
}

function DesktopTable({data}) {
    const sortController = useSortController();
    const {sortFn, sortKey, sortDir} = sortController;

    data.sort((a, b) => sortFunctions[sortFn](a[sortKey], b[sortKey]));
    if (sortDir < 0) {
        data.reverse();
    }

    return (
        <table className="body-block summary-table">
            <thead>
                <DesktopHeaderRow sortController={sortController} />
            </thead>
            <tbody>
                {data.map((entry) => <DesktopDataRow key={entry.id} entry={entry} />)}
            </tbody>
        </table>
    );
}

function MobileRow({entry, label, columnId}) {
    return (
        <tr>
            <th>{label}</th>
            <td>
                <div>
                    {
                        columnId === 'id' ?
                            <a href={entry[columnId]}>{entry[columnId] || ''}</a> :
                            (entry[columnId] || '')
                    }
                </div>
            </td>
        </tr>
    );
}

function MobileTable({entry}) {
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

function MobileTables({data}) {
    return (
        data.map((entry) => <MobileTable entry={entry} key={entry.id} />)
    );
}

function matchesFilter(filter, item) {
    const status = item.displayStatus;

    switch (filter) {
    case '':
        return true;
        break;
    case 'in-review':
        return status === 'In Review';
        break;
    case 'reviewed':
        return (/Reviewed|Will Correct|No Correction/).test(status);
        break;
    default:
        return (/^Corrected/).test(status);
    }
}

export default function Table({data, filter}) {
    const details = data.map((item) => {
        const displayStatus = getDisplayStatus(item);

        return {
            date: new Date(item.created).toLocaleDateString(),
            source: item.resource === 'Other' ? item.resourceOther : item.resource,
            displayStatus: displayStatus.status,
            barStatus: displayStatus.barStatus,
            errorType: item.errorType === 'Other' ? item.errorTypeOther : item.errorType,
            id: item.id,
            location: [item.location, item.additionalLocationInformation]
                .filter((loc) => loc).join('; '),
            detail: item.detail
        };
    })
        .sort((a, b) => b.id - a.id);
    const filteredDetails = details.filter((item) => matchesFilter(filter, item));

    return (
        <div className="boxed">
            <MobileTables data={filteredDetails} />
            <DesktopTable data={filteredDetails} />
        </div>
    );
}
