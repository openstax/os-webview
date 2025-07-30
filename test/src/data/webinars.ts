import {Webinar} from '~/pages/webinars/types';

const anHour = 1000 * 3600;
const aWeek = anHour * 24 * 7;

const upcomingWebinar: Webinar = {
    id: 1,
    subjects: [],
    collections: [],
    start: new Date(Date.now() + aWeek),
    end: new Date(Date.now() + aWeek + anHour),
    title: 'Upcoming Webinar',
    description: 'Academic self-efficacy',
    speakers: 'Preeti Ravi (Kritik)',
    registrationUrl:
        'https://event.on24.com/wcc/r/4347876/516C29B63558FFB28274BDE77CEAAFF7',
    registrationLinkText: 'Register today'
};

const pastWebinar: Webinar = {
    id: 2,
    subjects: [],
    collections: [],
    start: new Date(Date.now() - aWeek),
    end: new Date(Date.now() - aWeek + anHour),
    title: 'Past Webinar',
    description: 'Academic self-efficacy',
    speakers: 'Preeti Ravi (Kritik)',
    registrationUrl:
        'https://event.on24.com/wcc/r/4347876/516C29B63558FFB28274BDE77CEAAFF7',
    registrationLinkText: 'Register today'
};

const pageData = {
    title: 'Webinar title',
    heading: 'Webinar heading',
    webinars: []
};

export {upcomingWebinar, pastWebinar, pageData};
