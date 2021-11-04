import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(books) {
    const midPt = Math.ceil(books.length / 2);
    const firstHalf = books.slice(0, midPt);
    const secondHalf = books.slice(midPt);

    return [
        {
            name: 'Cool books',
            description: 'This is the first sub-category',
            books: firstHalf,
            id: 'cool-books'
        },
        {
            name: 'Nerd books',
            description: 'This is the other sub-category',
            books: secondHalf,
            id: 'nerd-books'
        }
    ];
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};
