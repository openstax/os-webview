import cmsFetch from './cmsFetch';

export default cmsFetch('v2/pages/?type=books.Book&fields=title,id&limit=250')
    .then((r) => r.items);
