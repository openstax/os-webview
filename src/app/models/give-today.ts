import cmsFetch from '~/helpers/cms-fetch';
import {useDataFromPromise} from '~/helpers/page-data-utils';

type PromiseData = {
    give_link_text: string;
    give_link: string;
    menu_start: string;
    menu_expires: string;
    start: string;
    expires: string;
}

function testDates(startDateStr: string, endDateStr: string) {
    const now = Date.now();
    const start = new Date(startDateStr).valueOf();
    const end = new Date(endDateStr).valueOf();

    return Boolean(start && end && now >= start && now <= end);
}

type GiveToday = PromiseData & {
    showButton: boolean;
    showLink: boolean;
}

type GiveTodayData = {
    menu_start: string;
    menu_expires: string;
    start: string;
    expires: string;
}

let promise: Promise<GiveTodayData>;

export default function useGiveToday(): Partial<GiveToday> {
    if (promise === undefined) {
        promise = cmsFetch('give-today');
    }
    const giveData = useDataFromPromise(promise);

    return giveData ? {
        ...giveData,
        showButton: testDates(giveData.menu_start, giveData.menu_expires),
        showLink: testDates(giveData.start, giveData.expires)
    } : {};
}
