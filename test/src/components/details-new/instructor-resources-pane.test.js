import InstructorResourcePane from '~/pages/details-new/phone-view/instructor-resources-pane/instructor-resources-pane.js';
import details from '../../data/details.js'
const instructorResources = {
    freeResources: details.book_faculty_resources,
    paidResources: details.book_allies
};
const userInfo = {
    "id":10001697,
    "username":"staging01",
    "first_name":"Michael",
    "last_name":"Freir",
    "full_name":"Michael Freir",
    "uuid":"d2c84d89-cbb9-41c5-bb2f-a5aeecff61db",
    "support_identifier":"cs_e7186964",
    "is_test":false,
    "salesforce_contact_id":"003c000000nUzUoAAK",
    "faculty_status":"confirmed_faculty",
    "self_reported_role":"instructor",
    "self_reported_school":"Denver University",
    "contact_infos":[
        {"id":1372,
        "type":"EmailAddress",
        "value":"h1089206@mvrht.net",
        "is_verified":true,
        "is_guessed_preferred":true}
    ],
    "applications":[
        {"id":1,"name":"OpenStax Exercises"},
        {"id":5,"name":"OpenStax CMS Dev"},
        {"id":12,"name":"Openstax Payment"},
        {"id":2,"name":"OpenStax Tutor"}
    ]
};

const userStatusPromise = new Promise((resolve) => {
    resolve(userInfo);
});


describe('InstructorResourcesPane', () => {
    it('matches snapshot', () => {
        const pane = new InstructorResourcePane({
            bookInfo: details,
            resources: instructorResources,
            userStatusPromise: userStatusPromise
        });

        console.log('To update snapshot: node_modules/.bin/jest --updateSnapshot --testNamePattern=Resource');
        expect(pane.el.innerHTML).toMatchSnapshot();
    });
});
