import cmsFetch from '~/helpers/cms-fetch';

type PromoteSnippet = {
    value: {
        id: number;
        name: string;
        description: string;
        image: string;
    }
}

export type Item = {
    id: number;
    book_state: string;
    title: string;
    promote_snippet: PromoteSnippet[];
    meta: {
        slug: string;
        detail_url: string;
    }
};

export default cmsFetch('pages/?type=books.Book&fields=title,id,book_state,promote_snippet&limit=250')
    .then((r) => r.items) as Promise<Item[]>;
