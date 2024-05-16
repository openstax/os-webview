import cmsFetch from '~/helpers/cms-fetch';
import {useDataFromPromise} from '~/helpers/page-data-utils';

const promise = cmsFetch('give-today');

function testDates(startDateStr: string, endDateStr: string) {
    const now = Date.now();
    const start = new Date(startDateStr).valueOf();
    const end = new Date(endDateStr).valueOf();

    return start && end && now >= start && now <= end;
}

export default function useGiveToday() {
    const giveData = useDataFromPromise(promise);

    return giveData ? {
        ...giveData,
        showButton: testDates(giveData.menu_start, giveData.menu_expires),
        showLink: testDates(giveData.start, giveData.expires)
    } : {};
}
