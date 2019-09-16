import cmsFetch from './cmsFetch';

export default cmsFetch('books?format=json')
    .then((r) => r.books);
