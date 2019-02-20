import componentType from '~/helpers/controller/init-mixin';
import css from './hero-journey.css';
import NumberedNavigator from './numbered-navigator/numbered-navigator';
import Books from './sections/books/books';
import Quiz from './sections/quiz/quiz';
import Try from './sections/try/try';
import Share from './sections/share/share';
import Thanks from './sections/thanks/thanks';
import $ from '~/helpers/$';
import settings from 'settings';
import {accountsModel} from '~/models/usermodel';

const spec = {
    css,
    view: {
        classes: ['hero-journey', 'page'],
        tag: 'main'
    }
    // slug: 'pages/hero-journey'
};

export default class extends componentType(spec) {

    init(...args) {
        super.init(...args);
        this.firstName = 'squire';
        this.accountId = '';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.school = '';
        this.accountsModelPromise = accountsModel.load();
    }

    onLoaded() {
        this.pageData = {
            title: 'Hero\'s Journey',
            steps: [
                {
                    task: 'Make an account'
                }, {
                    task: 'Look at the books'
                }, {
                    task: '?'
                }, {
                    task: 'Try OpenStax in your course'
                }, {
                    task: 'Share your story'
                }
            ]
        };
        this.onDataLoaded();
    }

    update() {
        if (this.regions) {
            const children = this.regions.self.controllers;

            children.forEach((c) => c.update());
        }
    }

    onDataLoaded() {
        const data = this.pageData;
        let lastCompleted = 0; // It's not really last completed, but currently active
        // Important: navigator and sections are the first (only) children
        const scrollPastCompleted = () => {
            const completedChild = this.regions.self.controllers[lastCompleted];

            completedChild.el.classList.remove('hidden');
            $.scrollTo(completedChild.el).then(() => {
                // Might have skipped some by getting saved progress
                this.regions.self.controllers.slice(1, lastCompleted)
                    .forEach((prevChild) => {
                        prevChild.el.classList.add('hidden');
                    });
            });
        };
        const updateLastCompleted = (newValue, save=true) => {
            if (lastCompleted < newValue) {
                lastCompleted = newValue;
                this.update();
                scrollPastCompleted();
                if (save) {
                    fetch(
                        `${settings.apiOrigin}/api/progress/?account_id=${this.accountId}`,
                        {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                account_id: this.accountId, // eslint-disable-line camelcase
                                progress: newValue
                            })
                        }
                    );
                }
            }
        };
        const navigator = new NumberedNavigator({
            getProps: () => {
                return {
                    steps: data.steps,
                    lastCompleted
                };
            }
        });
        const parent = this;

        this.accountsModelPromise.then((accountResponse) => {
            this.accountId = accountResponse.id;
            this.email = accountResponse.contact_infos
                .filter((i) => i.is_verified)
                .reduce((a, b) => (a.is_guessed_preferred ? a : b), {})
                .value;
            this.school = accountResponse.self_reported_school;
            fetch(`${settings.apiOrigin}/api/salesforce/adoption-status/?id=${this.accountId}`)
                .then((r) => r.json())
                .then((adoptionResponse) => {
                    if (adoptionResponse.records.length > 0) {
                        updateLastCompleted(4);
                    }
                });

            this.firstName = accountResponse.first_name;
            this.lastName = accountResponse.last_name;
            updateLastCompleted(1);
            this.update();

            fetch(`${settings.apiOrigin}/api/progress/?account_id=${this.accountId}`)
                .then((r) => r.json())
                .then((progress) => {
                    if (progress.length > 0) {
                        updateLastCompleted(progress.slice(-1)[0].progress, false);
                    }
                });
        });

        document.getElementById('main').classList.add('with-sticky');
        this.regions.self.append(navigator);
        this.regions.self.append(new Books({
            get email() {return parent.email;},
            heading: 'Get your Hero Badge',
            get firstName() {return parent.firstName;},
            description: `Thanks to open alternatives like OpenStax, textbook prices have
            started to fall for the first time in 50 years. Instructors who choose affordable,
            open materials aren't just champions in their classroom – they are causing a
            market-wide shift that's making school more affordable for all learners.`,
            subheading: 'You\'re already a hero in our eyes. Now it\'s time to make it official!',
            bookHeading: 'Look at the books',
            bookDescription: `You already completed step one when you made an account.
            The next step is to review the book to see if it could be useful in your course.
            Take a look, then come back here to continue your quest for the Hero Badge!`,
            booksLink: '/subjects',
            booksLinkText: 'Look at the books',
            skipHtml: 'Already reviewed the books? <a href="#skip">Click here.</a>',
            onComplete: () => {
                updateLastCompleted(2);
            }
        }));
        this.regions.self.append(new Quiz({
            heading: 'Pop Quiz!',
            skipLink: {
                link: '/adoption',
                text: 'Take me straight to the adoption form'
            },
            currentQuestion: 0,
            completeMessage: 'You aced it!',
            questions: [
                {
                    question: `
                    All our work is devoted to helping students succeed because
                    OpenStax is a(n) ___________`,
                    answers: [
                        'Urban legend',
                        'Non profit organization dedicated to breaking down barriers to education',
                        'Friendly woodland creature',
                        'Natural sprinter'
                    ],
                    correctIndex: 1
                },
                {
                    question: 'What formats are OpenStax books available in?',
                    answers: [
                        'Print',
                        'PDF and web view',
                        'Kindle and iBooks',
                        'All of the above!'
                    ],
                    correctIndex: 3
                },
                {
                    question: 'What additional resource are available with OpenStax books?',
                    answers: [
                        `Online homework, customization help, and other technology from our
                         ecosystem of partners`,
                        'PowerPoint slides',
                        'Getting started guides for instructors and students',
                        'All of the above and more!'
                    ],
                    correctIndex: 3
                }

            ],
            image: {
                image: '/images/hero-journey/2-quiz-illustration.svg',
                altText: 'man'
            },
            onComplete: () => {
                updateLastCompleted(3);
            }
        }));
        this.regions.self.append(new Try({
            heading: `Now that you've aced all our quiz questions, it's time to
            try out OpenStax in your course!`,
            description: `If you've decided to include our book in your syllabus - whether
            it's the primary text, a supplemental resource, or just a few chapters - let us know.`,
            instructions: 'More stuff about how you should fill this out',
            linkUrl: '/adoption',
            linkText: 'I\'m ready to try OpenStax',
            image: {
                image: '/images/hero-journey/3-reading-illustration.svg',
                altText: 'Girl reading'
            }
        }));
        this.regions.self.append(new Share({
            heading: 'Congratulations',
            get firstName() {return parent.firstName;},
            get lastName() {return parent.lastName;},
            book: 'Other',
            get email() {return parent.email;},
            get school() {return parent.school || 'none?';},
            description: `You're a true hero, and we can't thank you enough for the
            work you do. There's just one more step before you get your official
            OpenStax Hero Badge: share your story with us.`,
            instructions: `Tell us what you've learned about OpenStax, what you're most
            excited about for the future with your new text, or why you think it's
            important to share the power of an open textbook.`,
            image: {
                image: '/images/hero-journey/4-trophy-illustration.svg',
                altText: 'Trophy with excited people'
            },
            onComplete: () => {
                updateLastCompleted(5);
            }
        }));
        this.regions.self.append(new Thanks({
            heading: `Thank you, and welcome to the OpenStax family!
            We'll mail you your Hero Badge – you can use it as your email signature
            to show off your Hero status and help spread the word about OpenStax.`,
            description: `We’d love to send you a sticker as well! If you’d like to
            get a Hero Badge sticker in the mail, click
            <a href="http://www2.openstax.org/l/218812/2019-02-15/69zff">here</a>.`,
            image: {
                image: '/images/hero-journey/5-thanks-illustration.svg',
                altText: 'People with floating hearts'
            }
        }));
        navigator.update();
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        document.getElementById('main').classList.remove('with-sticky');
    }

}
