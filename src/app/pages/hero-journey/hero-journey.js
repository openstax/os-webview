import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './hero-journey.html';
import css from './hero-journey.css';
import NumberedNavigator from './numbered-navigator/numbered-navigator';
import Books from './sections/books/books';
import Quiz from './sections/quiz/quiz';
import Try from './sections/try/try';
import Share from './sections/share/share';
import Thanks from './sections/thanks/thanks';

const spec = {
    css,
    view: {
        classes: ['hero-journey', 'page'],
        tag: 'main'
    },
    slug: 'pages/hero-journey',
    model() {
        return {
            heading: this.heading
        };
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        this.pageData = {
            title: 'Hero\'s Journey',
            lastCompleted: 1,
            steps: [
                {
                    task: 'Get an account'
                }, {
                    task: 'Look at the books'
                }, {
                    task: 'Pop quiz!'
                }, {
                    task: 'Try a book in your course'
                }, {
                    task: 'Write a testimonial'
                }
            ]
        };
        this.onDataLoaded();
    }

    onDataLoaded() {
        const data = this.pageData;

        this.regions.self.append(new NumberedNavigator({
            getProps() {
                return {
                    steps: data.steps,
                    lastCompleted: data.lastCompleted
                };
            }
        }));
        this.regions.self.append(new Books({
            heading: 'Get your Hero Badge',
            firstName: 'Sonya',
            subheading: 'You\'re only a few steps away from becoming an official OpenStax Hero....',
            description: `Thanks to open alternatives like OpenStax, textbook prices have
            started to fall for the irst time in 50 years. Instructors who choose affordable,
            open materials aren't just champions in their classroom -- they are causing a
            market-wide shift that's making school more affordable for all learners.`,
            bookHeading: 'Look at the books',
            bookDescription: `You already completed step one when you made an account.
            The next step is to review the book to see if it could be useful in your course.
            Take a look, then come back here to continue your quest for the Hero Badge!`,
            booksLink: '/subjects',
            booksLinkText: 'Look at the books',
            skipHtml: 'Already reviewed the books? <a href="#skip">Click here.</a>'
        }));
        this.regions.self.append(new Quiz({
            heading: 'Pop Quiz!',
            skipLink: {
                link: '/adoption',
                text: 'Take me straight to the adoption form'
            },
            currentQuestion: 0,
            questions: [
                {
                    question: `
                    All our work is devoted to helping students succeed because
                    OpenStax is a(n) ___________`,
                    answers: [
                        'Urban legend',
                        'Non provid organization dedicatedto breaking down barriers to education',
                        'Friendly woodland creature',
                        'Natural sprinter'
                    ]
                }
            ],
            image: {
                image: '/images/hero-journey/2-quiz-illustration.png',
                altText: 'man'
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
                image: '/images/hero-journey/3-reading.png',
                altText: 'Girl reading'
            }
        }));
        this.regions.self.append(new Share({
            heading: 'Congratulations',
            description: `You're a true hero, and we can't thank you enough for the
            work you do. There's just one more step before you get your official
            OpenStax Hero Badge: share your story with us.`,
            instructions: `Tell us what you've learned, what you're most excited about
            for the future with your new text, or why you think it's important to share
            the power of an open textbook.`,
            image: {
                image: '/images/hero-journey/4-trophy.png',
                altText: 'Trophy with excited people'
            }
        }));
        this.regions.self.append(new Thanks({
            heading: `Now that you've aced all our quiz questions, it's time to
            try out OpenStax in your course!`,
            description: `If you've decided to include our book in your syllabus - whether
            it's the primary text, a supplemental resource, or just a few chapters - let us know.`,
            image: {
                image: '/images/hero-journey/5-thanks.png',
                altText: 'People with floating hearts'
            }
        }));
    }

}
