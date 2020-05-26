import cmsFetch from './cmsFetch';

export default cmsFetch('pages/?type=books.Book&fields=title,id&limit=250')
    .then((r) => r.items);
