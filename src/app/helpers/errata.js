function approvedStatuses(detail) {
    const posted = new Date(detail.created);
    const m = posted.getMonth();
    const y = posted.getFullYear();
    const postedSpring = m > 1 && m < 9;
    const correctionSeason = postedSpring ? `Fall ${y}` : `Spring ${y + 1}`;
    const correctionDate = new Date(postedSpring ? `${y}/11/1` : `${y + 1}/3/1`);
    const done = Date.now() > correctionDate;
    const barStatus = done ? 'Corrected' : 'Will correct';

    return {
        status: `${barStatus} ${correctionSeason}`,
        barStatus
    };
}

// eslint-disable-next-line complexity
export function getDisplayStatus(detail) {
    const result = {
        status: 'Reviewed',
        barStatus: ''
    };

    if (['New', 'Editorial Review'].includes(detail.status)) {
        result.status = 'In Review';
    } else if (detail.resolution === 'Approved') {
        Object.assign(result, approvedStatuses(detail));
    } else if (detail.status === 'Completed' && detail.resolution === 'Duplicate') {
        result.status = result.barStatus = 'Duplicate';
    } else {
        result.status = result.barStatus = 'No Correction';
    }

    return result;
}
