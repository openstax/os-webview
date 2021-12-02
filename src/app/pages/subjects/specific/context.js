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
        `,
        blogSectionDescription: `Read up on best practices for using our free
        business textbooks and instructor resources in your course in these blog
        posts.`,
        blogSectionViewAllText: 'View all blog posts',
        blogSectionViewAllUrl: '/blog',
        blogSectionBlurbs: [
            {
                image: 'https://assets.openstax.org/oscms-prodcms/media/documents/calculus-v2.svg',
                linkText: 'Curated community resources for OpenStax business books',
                link: 'google1.com'
            },
            {
                image: 'https://assets.openstax.org/oscms-prodcms/media/documents/college_algebra.svg',
                linkText: 'What makes OpenStax Principles of Accounting unique',
                link: 'google2.com'
            },
            {
                image: 'https://assets.openstax.org/oscms-prodcms/media/original_images/AdobeStock_382934760.png',
                linkText: 'Answering your FAQs about OpenStax (Business) textbooks',
                link: 'google3.com'
            }
        ],
        learnMore: [
            {
                title: 'General Business',
                html: 'Our free introduction...'
            },
            {
                title: 'Accounting',
                html: 'Some kind of thing about accounting...'
            }
        ],
        webinarSectionDescription: `Learn how our free textbooks are made
        straight from the experts. Get tips and tricks for using an OpenStax
        book from everyday educators.`,
        webinarSectionViewAllText: 'View all webinars',
        webinarSectionViewAllUrl: '/webinars',
        webinarSectionWatchText: 'Click here to watch!',
        webinarSectionBlurbs: [
            {
                title: 'Principles of Management author webinar',
                description: `Learn about Principles of Management, our free textbook
                for introductory management courses. This webinar covers strategies for
                teaching with our online textbook and how you can access additional free
                and low-cost resources.`,
                link: 'google1.com'
            },
            {
                title: 'Introduction to Business webinar',
                description: `Learn about Principles of Management, our free textbook
                for introductory management courses. This webinar covers strategies for
                teaching with our online textbook and how you can access additional free
                and low-cost resources.`,
                link: 'google2.com'
            },
            {
                title: 'OpenStax Businss Ethics with author Stephen Byars',
                description: `Learn about Principles of Management, our free textbook
                for introductory management courses. This webinar covers strategies for
                teaching with our online textbook and how you can access additional free
                and low-cost resources.`,
                link: 'google3.com'
            },
            {
                title: 'OpenStax Businss Ethics with author Stephen Byars',
                description: `Learn about Principles of Management, our free textbook
                for introductory management courses. This webinar covers strategies for
                teaching with our online textbook and how you can access additional free
                and low-cost resources.`,
                link: 'google4.com'
            }
        ]
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};
