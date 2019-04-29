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
import shellBus from '~/components/shell/shell-bus';

const spec = {
    css,
    view: {
        classes: ['hero-journey', 'page'],
        tag: 'main'
    },
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    accountId: ''
    // slug: 'pages/hero-journey'
};

export default class extends componentType(spec) {

    init(...args) {
        super.init(...args);
        this.accountsModelPromise = accountsModel.load();
    }

    onLoaded() {
        this.pageData = {
            title: 'Hero\'s Journey',
            steps: [
                {
                    task: 'Make an account',
                    hash: 'make-account'
                }, {
                    task: 'Look at the books',
                    hash: 'view-books'
                }, {
                    task: 'Learn more about us',
                    hash: 'quiz'
                }, {
                    task: 'Try OpenStax',
                    hash: 'try'
                }, {
                    task: 'Share your story',
                    hash: 'share'
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
        const setHash = (hash) => {
            const state = history.state;
            const pathWithoutHash = `${window.location.origin}${window.location.pathname}`;

            history.replaceState(state, '', `${pathWithoutHash}#${hash}`);
        };
        const displaySection = (index) => {
            const completedChild = this.regions.self.controllers[index];

            completedChild.el.classList.remove('hidden');
            $.scrollTo(completedChild.el).then(() => {
                // Might have skipped some by getting saved progress
                this.regions.self.controllers.slice(1, index)
                    .forEach((prevChild) => {
                        prevChild.el.classList.add('hidden');
                    });
                window.scrollTo(0, 0);
            });
            if (this.pageData.steps[index]) {
                setHash(this.pageData.steps[index].hash);
            }
        };
        const updateLastCompleted = (newValue, save=true) => {
            if (lastCompleted < newValue) {
                lastCompleted = newValue;
                this.update();
                displaySection(lastCompleted);
                if (save) {
                    fetch(
                        `${settings.apiOrigin}${settings.apiPrefix}/progress/?account_id=${this.accountId}`,
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

                if (lastCompleted === 5) {
                    const badgeEl = this.el.querySelector('.badge');

                    badgeEl.style.transition = 'right 0.5s, transform 0.3s';

                    window.requestAnimationFrame(() => {
                        badgeEl.style.right = '10rem';
                        badgeEl.style.transform = 'translate(50%, 50%) scale(3)';
                        setTimeout(() => {
                            badgeEl.style.removeProperty('right');
                            badgeEl.style.removeProperty('transform');
                        }, 3000);
                    });
                }
            }
        };
        const navigator = new NumberedNavigator({
            getProps: () => {
                return {
                    steps: data.steps,
                    lastCompleted,
                    visitNode: displaySection
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
            fetch(`${settings.apiOrigin}${settings.apiPrefix}/salesforce/adoption-status/?id=${this.accountId}`)
                .then((r) => r.json())
                .then((adoptionResponse) => {
                    if (adoptionResponse.records.some((r) =>
                        ['Current Adopter', 'Future Adopter'].includes(r.Adoption_Status__c)
                    )) {
                        updateLastCompleted(4);
                    }
                });

            this.firstName = accountResponse.first_name;
            this.lastName = accountResponse.last_name;

            fetch(`${settings.apiOrigin}${settings.apiPrefix}/progress/?account_id=${this.accountId}`)
                .then((r) => r.json())
                .then((progress) => {
                    if (progress.length > 0) {
                        const value = progress.slice(-1)[0].progress;
                        const safeValue = value > 0 ? value : 1;

                        updateLastCompleted(safeValue, false);
                    } else {
                        updateLastCompleted(1);
                    }
                });
        });

        shellBus.emit('with-sticky');
        this.regions.self.append(navigator);
        this.regions.self.append(new Books({
            get email() {return parent.email;},
            heading: 'Get your Hero Badge',
            get firstName() {return parent.firstName;},
            login: `${settings.apiOrigin}/oxauth/login/?next=${encodeURIComponent(window.location.href)}`,
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
            skipHtml: 'Already reviewed the books? <b><a href="#skip">Click here</a></b>.',
            onComplete: () => {
                updateLastCompleted(2);
            }
        }));

        const questions = [
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

        ];
        const longestAnswer = questions.map((qa) => qa.answers.reduce((a, b) => b.length > a.length ? b : a, ''))
            .reduce((a, b) => b.length > a.length ? b : a, '');

        this.regions.self.append(new Quiz({
            heading: 'Pop Quiz!',
            skipLink: {
                link: '/adoption',
                text: 'Take me straight to the adoption form'
            },
            currentQuestion: 0,
            completeMessage: 'You aced it!',
            questions,
            longestAnswer,
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
            We'll email you your Hero Badge – you can use it as your email signature
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
        shellBus.emit('no-sticky');
    }

}
