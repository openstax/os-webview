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
    }
    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PageContextProvider};
