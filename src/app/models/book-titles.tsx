import cmsFetch from '~/helpers/cms-fetch';

export type Item = {
    id: number;
    book_state: string;
    title: string;
    assignable_book: boolean;
};

export default cmsFetch('pages/?type=books.Book&fields=title,id,book_state,assignable_book&limit=250')
    .then((r) => r.items) as Promise<Item[]>;
