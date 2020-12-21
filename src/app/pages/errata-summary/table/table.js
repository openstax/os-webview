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

function DesktopHeaderColumn({md, sortController}) {
    const {sortKey, sortDir, setSortFn, setSortDir, setSortKey} = sortController;
    const onClick = (event) => {
        if (sortKey === md.id) {
            setSortDir(-sortDir);
        } else {
            setSortFn(md.sortFn);
            setSortKey(md.id);
            setSortDir(1);
        }
    };
    const sortAttributes = md.sortFn ? {
        role: 'button', tabIndex: 0, onClick, onKeyDown: $.treatSpaceOrEnterAsClick
    } : {};
    const sortIndicator = md.sortFn ?
        <span className={`will-sort sortdir${md.sortFn === 'sort' ? 1 : -1}`} /> :
        null;

    return (
        <th
            key={md.id}
            className={md.cssClass}
            {...sortAttributes}
        >
            {md.label}
            {
                sortKey === md.id ?
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
                columnSpecs.map((md) =>
                    <DesktopHeaderColumn key={md.id} md={md} sortController={sortController} />
                )
            }
        </tr>
    );
}

function DesktopDataColumn({md, entry}) {
    return (
        <td>
            <div className={md.cssClass}>
                {
                    md.id === 'id' ?
                        <a href={entry[md.id]}>{entry[md.id] || ''}</a> :
                        <React.Fragment>
                            {entry[md.id]}{' '}
                            {
                                md.id === 'displayStatus' && entry[md.id] === 'No Correction' &&
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
            {columnSpecs.map((md) => <DesktopDataColumn key={md.id} md={md} entry={entry} />)}
        </tr>
    );
}

function useSortController() {
    const [sortFn, setSortFn] = useState('sortDate');
    const [sortKey, setSortKey] = useState('date');
    const [sortDir, setSortDir] = useState(1);

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
                    columnSpecs.map((md) =>
                        <MobileRow
                            key={md.label}
                            entry={entry}
                            label={md.label}
                            columnId={md.id}
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
            ...item
        };
    });
    const filteredDetails = details.filter((item) => matchesFilter(filter, item));

    return (
        <div className="boxed">
            <MobileTables data={filteredDetails} />
            <DesktopTable data={filteredDetails} />
        </div>
    );
}
