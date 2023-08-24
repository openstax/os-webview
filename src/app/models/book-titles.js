import cmsFetch from '~/helpers/cms-fetch';

export default cmsFetch('pages/?type=books.Book&fields=title,id,book_state,assignable_book&limit=250')
    .then((r) => r.items);
