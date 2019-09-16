import cmsFetch from './cmsFetch';

export default cmsFetch('pages/partners')
    .then((obj) => Object.values(obj.allies).filter((a) => !a.do_not_display));
