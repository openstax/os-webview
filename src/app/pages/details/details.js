import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import {props} from '~/helpers/backbone/decorators';
import {template} from './details.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';

let dummyHomeworkData = {
    vendor: 'Sapling Learning',
    imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Logo&w=200&h=45',
    blurb: `
    Bacon ipsum dolor amet incididunt aliqua salami tongue fugiat
    anim. Andouille sunt labore sint, incididunt turkey tri-tip
    swine pork chop jowl cow fatback spare ribs shank enim. Commodo
    cow laborum ad adipisicing spare ribs excepteur.`
};

@props({
    model: new BaseModel(),
    template: template,
    templateHelpers: function () {
        return this.model.get('bookInfo');
    },
    regions: {
        getThisTitle: '.get-this-book'
    }
})
export default class Subjects extends BaseView {
    constructor() {
        super(...arguments);
        this.title = decodeURIComponent(window.location.search.substr(1));
        this.model.set('bookInfo', {
            title: this.title,
            blurb: `College Physics meets standard scope and sequence requirements for a
                two-semester introductory alegabra-based physics course. The text is
                grounded aliqua salami tongue fugiat anim. Andouille sunt labore sint,
                incididunt turkey tri-tip swine pork chop jowl cow fatback spare ribs shank
                enim. Commodo cow laborum ad adipisicing spare ribs excepteur.`,
            mainAuthorTitle: 'Senior Contributing Authors',
            mainAuthorHtml: `
                 <p>Dr. Paul Peter Urone, California State University Sacramento</p>
                 <p>Dr. Roger Hinrichs, State University of New York, College at Oswego</p>
            `,
            allAuthorsHtml: `
                 <h2>Senior Contributing Authors</h2>
                 <p>Dr. Paul Peter Urone, California State University Sacramento</p>
                 <p>Dr. Roger Hinrichs, State University of New York, College at Oswego</p>
                 <h2>Contributing Authors</h2>
                 <p>Dr. Paul Peter Urone, California State University Sacramento</p>
                 <p>Dr. Roger Hinrichs, State University of New York, College at Oswego</p>
            `,
            endorsement: `We are adopting the Physics text and I love it. We use mostly the
                Kinematics chapters, but wow, what a great way to get this information to
                people in our field.`,
            attribution: 'Maureen Caroll, ASET',
            instructorResources: [
                {
                    title: 'Getting Started Guide for Instructors',
                    iconUrl: 'http://wwwimages.adobe.com/content/dam/acom/en/legal/images/badges/Adobe_PDF_file_icon_32x32.png',
                    downloadUrl: '/downloads'
                },
                {
                    title: 'PowerPoint Slides',
                    iconUrl: 'http://icons.iconarchive.com/icons/dakirby309/windows-8-metro/256/Office-Apps-PowerPoint-alt-1-Metro-icon.png',
                    downloadUrl: '/downloads'
                },
                {
                    title: 'Sample Syllabus Language',
                    iconUrl: 'http://wwwimages.adobe.com/content/dam/acom/en/legal/images/badges/Adobe_PDF_file_icon_32x32.png',
                    downloadUrl: '/downloads'
                },
                {
                    title: 'Instructor Solution Manual',
                    iconUrl: 'http://wwwimages.adobe.com/content/dam/acom/en/legal/images/badges/Adobe_PDF_file_icon_32x32.png',
                    downloadUrl: '/downloads'
                }
            ],
            onlineHomework: [
                dummyHomeworkData, dummyHomeworkData, dummyHomeworkData
            ],
            adaptiveCourseware: [
                dummyHomeworkData, dummyHomeworkData, dummyHomeworkData
            ]
        });
    }

    onRender() {
        this.regions.getThisTitle.show(new GetThisTitle(this.title));
    }
}
