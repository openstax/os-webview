import BaseView from '~/helpers/backbone/view';
import TextInputView from './form-elements/text-input';
import SelectView from './form-elements/select';
import RadioGroupView from './form-elements/radio-group';
import CheckboxGroupView from './form-elements/checkbox-group';
import toggleAnchor from './form-elements/toggle-anchor';
import {props} from '~/helpers/backbone/decorators';
import {template} from './adoption.hbs';

function adoptionize(label) {
    return label.toLowerCase().replace(/ /g, '_');
}

function simpleTextInputTemplate(label) {
    let asId = adoptionize(label);

    return {
        id: `adoption_${asId}`,
        label: label,
        name: `adoption[${asId}]`,
        required: true,
        size: 30
    };
}

let fields = [
    'First name', 'Last name',
    'School name', 'School url',
    'Email address', 'Phone number'
].map((label) => simpleTextInputTemplate(label));

let books = [
    'Algebra and Trigonometry',
    'Anatomy and Physiology',
    'Biology',
    'Chemistry',
    'College Algebra',
    'College Physics',
    'College Physics for AP® Courses ',
    'Concepts of Biology',
    'Introduction to Sociology',
    'Introduction to Sociology 2e',
    'Introductory Statistics',
    'Prealgebra',
    'Precalculus',
    'Principles of Economics',
    'Principles of Macroeconomics',
    'Principles of Macroeconomics for AP® Courses',
    'Principles of Microeconomics',
    'Principles of Microeconomics for AP® Courses',
    'Psychology',
    'U.S. History'
];

let partners = [
    'None',
    'Cerego',
    'Courseweaver',
    'Expert TA',
    'Lrnr',
    'Sapling Learning',
    'SimBio',
    'WebAssign',
    'Wiley Plus',
    'XYZ Homework'
];

let infoSharing = [
    'Online homework providers',
    'Courseware providers',
    'Print custom editions'
];

function validateForm(event) {
    event.preventDefault();
}

@props({
    template: template,
    regions: {
        contact: '#adoption-form-contact-section',
        textbookAdoption: '#adoption-form-textbook-adoption-section',
        partners: '#adoption-form-partners-section',
        infoSharing: '#adoption-form-info-share-section',
        studentCounts: '#adoption-form-student-count-section',
        yesOrNo: '#adoption-form-yes-no',
        otherContact: '#adoption-form-other-contact',
        secondBook: '#adoption-form-second-textbook'
    }
})
export default class Adoption extends BaseView {
    onRender() {
        let form = document.getElementById('adoption-form');

        form.addEventListener('submit', validateForm);
        for (let f of fields) {
            this.regions.contact.append(new TextInputView(f));
        }
        this.regions.textbookAdoption.append(new SelectView({
            label: 'OpenStax College textbook you are using:',
            id: 'adoption_textbook',
            required: true,
            name: 'adoption[textbook]',
            options: books
        }));
        this.regions.textbookAdoption.append(new RadioGroupView({
            label: 'How are you using this title?',
            required: true,
            options: [
                {
                    id: 'adoption_adoption_status_adopted',
                    label: 'Fully adopted and using it. The students don\'t have to pay for a book.',
                    name: 'adoption[adoption_status]',
                    value: 'Adopted',
                    checked: true
                },
                {
                    id: 'adoption_adoption_status_recommending_book_as_adoption',
                    label: 'Recommending the book as an option. The students purchase a different book.',
                    name: 'adoption[adoption_status]',
                    value: 'Recommending book as adoption'
                }
            ]
        }));
        // ### Partners checkboxes ###
        let boxIdFromPartner = (partner) =>
             `adoption_partner_resources_${adoptionize(partner)}`;

        this.regions.partners.append(new CheckboxGroupView({
            topLabel: `Which partner resources are you using with the OpenStax College book?`,
            prefix: 'adoption',
            boxGroupName: 'adoption[partner_resources][]',
            labels: partners,
            idFromLabel: boxIdFromPartner,
            required: true,
            other: true
        }));

        // ### Partners to share information with ###
        this.regions.infoSharing.append(new CheckboxGroupView({
            topLabel: `Which partners may we share your information with so they
             may contact you about additional resources supporting the OpenStax
             College books?`,
            prefix: 'adoption',
            boxGroupName: 'adoption[partner_resource_type][]',
            labels: infoSharing,
            idFromLabel: (resType) =>
             `adoption_partner_resource_type_${adoptionize(resType)}`,
            required: false
        }));

        this.regions.studentCounts.append(new TextInputView({
            id: 'adoption_students_per_semester',
            label: `Approximately how many students in your classes will be using
             this book per semester?`,
            name: 'adoption[students_per_semester]',
            value: true,
            size: 5
        }));
        this.regions.studentCounts.append(new TextInputView({
            id: 'adoption_other_faculty_usage_count',
            label: `If there are other faculty in your department who will also be
             using this book, approximately how many students in your department
             will be using this book per semester?`,
            name: 'adoption[other_faculty_usage_count]',
            size: 5
        }));

        this.regions.yesOrNo.append(new RadioGroupView({
            label: 'Are you interested in being featured in our newsletter as a Textbook Hero?',
            required: true,
            options: [
                {
                    id: 'adoption_interested_in_newsletter_feature_true',
                    label: 'Yes',
                    name: 'adoption[interested_in_newsletter_feature]',
                    value: 'true',
                    checked: true
                },
                {
                    id: 'adoption_interested_in_newsletter_feature_false',
                    label: 'No',
                    name: 'adoption[interested_in_newsletter_feature]',
                    value: 'false'
                }
            ]
        }));
        this.regions.yesOrNo.append(new RadioGroupView({
            label: `OpenStax and Rice University researchers conduct several
             pilots and research studies. May we contact you about opportunities
             to participate in future pilots or studies?`,
            required: true,
            options: [
                {
                    id: 'adoption_interested_in_research_true',
                    label: 'Yes',
                    name: 'adoption[interested_in_research]',
                    value: 'true',
                    checked: true
                },
                {
                    id: 'adoption_interested_in_research_false',
                    label: 'No',
                    name: 'adoption[interested_in_research]',
                    value: 'false'
                }
            ]
        }));

        let hintTextInputTemplate = (label) => {
            let asId = adoptionize(label);

            return {
                id: `adoption_hint_${asId}`,
                label,
                name: `adoption[hint_${asId}]`,
                size: 30
            };
        };

        let hintFields = [
            'First name', 'Last name',
            'Email address', 'Phone number'
        ].map((label) => hintTextInputTemplate(label));

        for (let f of hintFields) {
            this.regions.otherContact.append(new TextInputView(f));
        }

        this.regions.secondBook.append(new SelectView({
            label: 'OpenStax College textbook you are using:',
            id: 'adoption_two_textbook',
            name: 'adoption_two[textbook]',
            options: books
        }));
        this.regions.secondBook.append(new RadioGroupView({
            label: 'How are you using this title?',
            required: true,
            options: [
                {
                    id: 'adoption_two_adoption_status',
                    label: 'Fully adopted and using it. The students don\'t have to pay for a book.',
                    name: 'adoption_two[adoption_status]',
                    value: 'Adopted',
                    checked: true
                },
                {
                    id: 'adoption_two_adoption_status_recommending_book_as_adoption',
                    label: 'Recommending the book as an option. The students purchase a different book.',
                    name: 'adoption_two[adoption_status]',
                    value: 'Recommending book as adoption'
                }
            ]
        }));

        let adoptionTwoIdFromPartner = (partner) =>
         `adoption_two_partner_resources_${adoptionize(partner)}`;

        this.regions.secondBook.append(new CheckboxGroupView({
            topLabel: `Which partner resources are you using with the OpenStax College book?`,
            prefix: 'adoption_two',
            boxGroupName: 'adoption_two[partner_resources][]',
            labels: partners,
            idFromLabel: adoptionTwoIdFromPartner,
            required: true,
            other: true
        }));
        this.regions.secondBook.append(new TextInputView({
            id: 'adoption_two_students_per_semester',
            label: `Approximately how many students in your classes will be using this book per semester?`,
            name: 'adoption[students_per_semester]',
            value: true,
            size: 5
        }));

        this.regions.secondBook.append(new TextInputView({
            id: 'adoption_two_other_faculty_usage_count',
            label: `If there are other faculty in your department who will also be
             using this book, approximately how many students in your department
             will be using this book per semester?`,
            name: 'adoption[other_faculty_usage_count]',
            size: 5
        }));

        toggleAnchor({
            id: 'additional-book-link',
            divId: 'adoption-form-second-textbook',
            openText: 'Add a second book',
            closeText: 'Remove the second book'
        });
    }
}
