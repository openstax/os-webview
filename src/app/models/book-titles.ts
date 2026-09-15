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

const path = 'pages/?type=books.Book&fields=title,id,book_state,promote_snippet&limit=250';

let bookPromise: Promise<Item[]> | null = null;

export function getBookTitles() {
    if (!bookPromise) {
        bookPromise = (cmsFetch(path).then((r) => r.items) as Promise<Item[]>)
            .catch((error: Error) => {
                bookPromise = null;
                throw error;
            });
    }

    return bookPromise;
}

export default getBookTitles();
