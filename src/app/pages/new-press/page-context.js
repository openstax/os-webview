import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/helpers/use-page-data';

function useContextValue() {
    const value = usePageData('press');

    if (value) {
        /* TEMPORARY FAKE DATA UNTIL THE CMS IS UPDATED */
        value.image =
            'https://assets.openstax.org/oscms-prodcms/media/original_images/Assignable_header_1.jpg';
        value.headline = 'In the News';
        value.subheading =
            'OpenStax is part of Rice University, which is a 501(c)(3) nonprofit charitable organization.';
        value.description = `
        As an educational initiative, we provide a large library of free, high-quality,
        peer-reviewed, openly licensed textbooks for high school and college along with
        cutting edge education research and an innovative high school algebra curriculum. 

        All of this work serves our commitment to building a future where each and every
        student can access the tools they need to complete their courses and achieve their
        educational dreams. 
        `;

        value.featuredIn = [
            'NYT',
            'Inside',
            'WaPo',
            'Hatchet',
            'Forbes',
            'PNS'
        ].map((name) => ({
            name,
            url: `http://${name}.com`,
            image: `https://placehold.co/240x160?text=${name}`
        }));

        value.testimonials = [
            {
                image: `https://placehold.co/240x320?text=${'Vince'}`,
                text: `“I have had many students tell me if it wasn’t for OpenStax they would
                have considered leaving school because they could not afford the additional
                expense of traditional textbooks.”`,
                who: 'Vincent Scarpinato, Business Department Chair, Arizona Christian University'
            },
            {
                image: `https://placehold.co/240x320?text=${'Shakari'}`,
                text: `“The interactiveness of the textbooks makes learning fun. Additional
                textbooks also cost money which is not an issue when it comes to OpenStax. Overall,
                I would say that OpenStax has been a great teacher.”`,
                who: 'Shakari Jones, Midlands Technical College'
            },
            {
                image: `https://placehold.co/240x320?text=${'Marcia'}`,
                text: `I definitely recommend it to everyone, especially those who are interested in
                a topic but don’t know where to start. OpenStax is a great resource because it is
                well-written by those who know what they are talking about. To students who have never
                used OpenStax before: “Try it. Why not, it’s free!”`,
                who: 'Marcia Humphreys, Truman State Univ.'
            }
        ];

        value.faqs = [
            {
                answer: `<p>It takes 10-20 minutes to set up your OpenStax Tutor Beta account and
                create your course within the tool once you have your verified instructor account.
                Detailed page tips walk you through each feature of the tool step by step to help
                you hit the ground running. We manually verify every instructor account to make
                sure students don’t get access to instructor materials, so if you don’t yet have
                an instructor account with OpenStax, expect to wait 3-5 days for our Support Team
                to verify you.</p>`,
                question:
                    '<p>How much time does it take to set up my course in OpenStax Tutor Beta?</p>'
            },
            {
                answer: `<p>OpenStax Tutor Beta allows you to export your scores into a spreadsheet
                to be uploaded into your learning management system. We are working towards full
                LMS integration for fall 2018.</p>`,
                question: '<p>Does it work with my LMS?</p>'
            }
        ];
    }
    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PageContextProvider};
