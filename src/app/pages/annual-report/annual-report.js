import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './annual-report.html';
import css from './annual-report.css';
import createSection from './section/section';

function camelCase(underscored) {
    return underscored.replace(/_([a-z])/g, (_, chr) => chr ? chr.toUpperCase() : '');
}

function camelCaseKeys(obj) {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Array) {
        return obj.map((v) => camelCaseKeys(v));
    }

    const result = {};

    Reflect.ownKeys(obj).forEach((k) => {
        result[camelCase(k)] = camelCaseKeys(obj[k]);
    });

    return result;
}

const spec = {
    template,
    css,
    view: {
        classes: ['annual-report', 'page'],
        tag: 'main' // if the HTML doesn't contain a main tag
    },
    slug: 'pages/annual-report',
    preserveWrapping: true,
    model: null
};

export default class AnnualReport extends componentType(spec) {

    onLoaded() {
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-loading');
    }

    /*
    {
       improvingAccess: {
           backgroundImage: 'https://via.placeholder.com/1500x770',
           heading: 'Improving access, learning, our world',
           description: `
           <i>Lorem Ipsum</i> is simply dummy text of the printing and typesetting industry.
           Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
           when an unknown printer took a galley of type and scrambled it to make a
           type specimen book. It has survived not only five centuries, but also the
           leap into electronic typesetting, remaining essentially unchanged. It was
           popularised <b>in the 1960s</b> with the release of Letraset sheets containing Lorem
           Ipsum passages, and more recently with desktop publishing software like Aldus
           PageMaker including versions of Lorem Ipsum.
           `,
           giveText: 'Give today!'
       },
       revolution: {
           heading: 'A revolution in education',
           letterBody: `
           <p>Bacon ipsum dolor amet burgdoggen leberkas jowl venison porchetta. Tri-tip
           leberkas meatloaf strip steak venison pork loin ham. Picanha burgdoggen swine
           meatloaf pork loin tenderloin, sirloin turkey kevin short ribs pork pork chop.
           Ball tip sirloin short loin bacon picanha turkey ham.</p>
           <p>T-bone brisket chicken, prosciutto hamburger capicola cupim. Sausage ham hock
           ball tip, shankle brisket beef ribs corned beef chicken pastrami shank fatback
           alcatra boudin frankfurter ground round.</p>
           <p>Does your lorem ipsum text long for something a little meatier?
           Give our generator a try… it’s tasty!</p>
           `,
           signatureImage: 'https://via.placeholder.com/250x70?text="Ann Doerr"',
           signatureAlt: 'Ann Doerr signature',
           signatureText: 'OpenStax Advisor<br>Rice University Board Trustee and Alum',
           portrait: 'https://via.placeholder.com/600x750?text="Ann Doerr"',
           portraitAlt: 'Ann Doerr portrait'
       },
       founding: {
           caption: `
           <b>Dr. Richard baraniuk,</b>
           <p>Founder of OpenStax, Victor E. Cameron Professor of Electrical and
           computer engineering at Rice Univeristy, and Fellow of the American
           Academy of Arts and Sciences</p>
           `,
           portrait: 'https://via.placeholder.com/600x750?text="Rich baraniuk"',
           portraitAlt: 'Richard Baraniuk portrait',
           heading: 'Founding Vision',
           description: `In 1999, dolor amet burgdoggen leberkas jowl venison porchetta. Tri-tip
           leberkas meatloaf strip steak venison pork loin ham. Picanha burgdoggen swine`
       },
       reach: {
           heading: 'Our Reach',
           description: `
           This year 2.2 million shankle brisket beef ribs corned beef
           chicken pastrami shank fatback alcatra boudin frankfurter ground round.`,
           factHeading: 'This year',
           facts: [
               {
                   number: 2.2,
                   unit: 'Million',
                   text: 'Students use OpenStax textbooks'
               },
               {
                   number: 1.3,
                   unit: 'Million',
                   text: '2-year degree students use OpenStax textbooks'
               },
               {
                   number: 286,
                   unit: 'K',
                   text: '4-year degree students use OpenStax textbooks'
               },
               {
                   number: 114,
                   unit: 'K',
                   text: 'High school students use OpenStax textbooks'
               }
           ]
       },
       testimonials: {
           heading: 'A year at OpenStax',
           description: '2017 brought unprecedented growth to OpenStax.',
           testimonials: [
               {
                   image: 'https://via.placeholder.com/480x240',
                   imageAlt: 'YouTube thumbnail',
                   quote: `
                   "When you're living paycheck to paycheck and relying on
                   government assistance and food pantries, $200 may as well
                   be $2 million."
                   `,
                   link: 'http://youtube.com',
                   linkText: 'Read more'
               },
               {
                   image: 'https://via.placeholder.com/480x240',
                   imageAlt: 'Woman face',
                   quote: `
                   "I'm convinced that shankle brisket beef ribs corned beef
                   chicken pastrami shank fatback
                   alcatra boudin frankfurter ground round."
                   `,
                   link: 'http://youtube.com',
                   linkText: 'Read more'
               },
               {
                   image: 'https://via.placeholder.com/480x240',
                   imageAlt: 'Man face',
                   quote: `
                   "Students are learning shankle brisket beef ribs corned beef
                   chicken pastrami shank fatback
                   alcatra boudin frankfurter ground round."
                   `,
                   link: 'http://youtube.com',
                   linkText: 'Read more'
               }
           ]
       },
       sustainability: {
           heading: 'Sustainability',
           description: `
           Through an ecosystem of over 50 allied partners, venison pork loin
           ham. Picanha burgdoggen swine
           meatloaf pork loin tenderloin, sirloin turkey kevin short ribs pork pork chop.
           Ball tip sirloin short loin bacon picanha turkey ham.`,
           partners: [
               {
                   image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/openstax-2_lUoTAmX.png',
                   imageAlt: 'Barns & Noble Education Courseware'
               },
               {
                   image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/sapling_new.png',
                   imageAlt: 'Sapling Learning'
               },
               {
                   image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/webassign_new.png',
                   imageAlt: 'WebAssign'
               },
               {
                   image: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/original_images/openstax-5.png',
                   imageAlt: 'McGraw Hill'
               }

           ]
       },
       disruption: {
           heading: 'Positive disruption',
           description: `
           Since 1965, textbook prices have venison pork loin ham. Picanha burgdoggen swine
           meatloaf pork loin tenderloin, sirloin turkey kevin short ribs pork pork chop.
           Ball tip sirloin short loin bacon picanha turkey ham.`,
           graph: {
               topCaption: 'Consumer Price Index Education books and Supplies, January 1967 to September 2017',
               bottomCaption: `
               <a href="http://www.aei.org/publication/wednesday-afternoon-links-30/">
               http://www.aei.org/publication/wednesday-afternoon-links-30/</a><br>
               Published by Mark Perry on October 25, 2017, AEI.org
               `,
               image: 'https://via.placeholder.com/1500x620?text="Cost%20per%20student"',
               imageAlt: 'Graph of textbook cost per student'
           }
       },
       lookingAhead: {
           heading: 'Looking ahead',
           description: `We are creating textbooks for the venison pork loin ham. Picanha
           burgdoggen swine
           meatloaf pork loin tenderloin, sirloin turkey kevin short ribs pork pork chop.
           Ball tip sirloin short loin bacon picanha turkey ham.`,
           image: 'https://via.placeholder.com/800x600'
       },
       map: {
           heading: 'OpenStax textbooks are used in more than 100 countries.',
           description: 'Check out our interactive map to find all the schools that are using our books.',
           link: '/impact-dev',
           linkText: 'Start exploring',
           backgroundImage: 'https://via.placeholder.com/1500x770/C9D1E2?text=background%20map',
           image1: {
               image: 'https://via.placeholder.com/800x600/DDDDFF?text=desktop%20map',
               imageAlt: 'desktop map'
           },
           image2: {
               image: 'https://via.placeholder.com/320x600?text=phone%20map',
               imageAlt: 'phone map'
           }
       },
       tutor: {
           heading: 'OpenStax Tutor Beta',
           description: `
           OpenStax developed adaptive courseware technology that wraps around its
           consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
           et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
           ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
           dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
           pariatur. `,
           link: '/openstax-tutor',
           linkText: 'Learn more about OpenStax Tutor Beta',
           rightImage: {
               image: 'https://via.placeholder.com/1050x750?text="tutor%20screenshot"',
               imageAlt: 'Tutor screenshot'
           },
           bottomImage: {
               image: 'https://via.placeholder.com/1500x100?text="trees%20with%20transparency',
               imageAlt: 'Bottom border trees and snow'
           }
       },
       philanthropicPartners: {
           heading: 'Philanthropic partners',
           description: 'Thank you to Rice University, our generous supporters, and strategic advisors',
           image: 'https://via.placeholder.com/500x625?text="Robert Maxfield portrait',
           imageAlt: 'Robert Maxfield portrait',
           quote: `
           I've always been interested in science and education
           consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
           et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation`,
           attributionName: 'Robert R. Maxfield',
           attributionTitle: `
           OpenStax Strategic Advisor<br>
           President of the Maxfield Foundation`,
           link1: {
               link: '/foundation',
               linkText: 'Learn more about our Supporters'
           },
           link2: {
               link: '/team#Strategic Advisors',
               linkText: 'Learn more about our Strategic Advisors'
           }
       },
       give: {
           heading: 'Are you ready to give?',
           description: `Support the creation and continuation of peer-reviewed,
           openly licensed textbooks.`,
           link: '/give',
           linkText: 'Give today!'
       }
   };
   */

    setModel() {
        const result = {};

        Reflect.ownKeys(this.pageData)
            .filter((k) => this.pageData[k] instanceof Array)
            .forEach((k) => {
                const values = this.pageData[k];
                const newEntry = {};

                values.forEach((v) => {
                    newEntry[camelCase(v.type)] = camelCaseKeys(v.value);
                });
                result[camelCase(k)] = newEntry;
            });

        // Some things not currently provided in the data cause breakage
        result.disruption.graph = {};
        result.map.image1 = result.map.image2 = result.tutor.rightImage = result.tutor.bottomImage = {};
        result.philanthropicPartners.link1 = result.philanthropicPartners.link2 = {};
        Object.assign(result.revolution, {
            signatureImage: 'https://via.placeholder.com/250x70?text="Ann Doerr"',
            signatureAlt: 'Ann Doerr signature',
            signatureText: 'OpenStax Advisor<br>Rice University Board Trustee and Alum',
            portrait: 'https://via.placeholder.com/600x750?text="Ann Doerr"',
            portraitAlt: 'Ann Doerr portrait'
        });
        result.founding.portrait = 'https://via.placeholder.com/600x750?text="Rich Baraniuk"';

        this.model = result;
    }

    onDataLoaded() {
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
        this.setModel();
        this.update();
        this.insertHtml();

        const insertComponent = (id, modelKey = id, content=true) => {
            this.regionFrom(`#${id}`).attach(createSection(id, this.model[modelKey], content));
        };

        insertComponent('banner', 'improvingAccess');
        insertComponent('founding');
        insertComponent('reach');
        insertComponent('revolution');
        insertComponent('testimonials');
        insertComponent('sustainability');
        insertComponent('lookingAhead');
        insertComponent('disruption');
        insertComponent('philanthropic-partners', 'philanthropicPartners');
        insertComponent('giving');
        insertComponent('map', 'map', false);
        insertComponent('tutor', 'tutor', false);
    }

}
