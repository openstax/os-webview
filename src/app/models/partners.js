import cmsFetch from '~/helpers/cms-fetch';

export default cmsFetch('pages/partners')
    .then((obj) => Object.values(obj.allies).filter((a) => !a.do_not_display));
