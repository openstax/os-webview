import cmsFetch from '~/helpers/cms-fetch';
import {useDataFromPromise} from '~/helpers/page-data-utils';

const promise = cmsFetch('give-today');

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

export default function useGiveToday(): Partial<GiveToday> {
    const giveData = useDataFromPromise<{
        menu_start: string;
        menu_expires: string;
        start: string;
        expires: string;
    }>(promise);

    return giveData ? {
        ...giveData,
        showButton: testDates(giveData.menu_start, giveData.menu_expires),
        showLink: testDates(giveData.start, giveData.expires)
    } : {};
}
