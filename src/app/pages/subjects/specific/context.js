import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(books) {
    const midPt = Math.ceil(books.length / 2);
    const firstHalf = books.slice(0, midPt);
    const secondHalf = books.slice(midPt);
    const subcategories = [
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

    return {
        translations: [],
        subcategories,
        introText: 'Open textbooks',
        introHtml: `
            <b>Simple to use, simple to adopt.</b> Our online business textbooks are designed
            to meet the standard scope and sequence requirements of several business
            courses – and are 100% free. Complete with free resources for educators
            (like course cartridges, PowerPoints, test banks, and more), check out our
            books to see if they&apos;re right for your course.
        `
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};
