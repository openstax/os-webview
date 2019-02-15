import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './quiz.html';
import css from './quiz.css';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    view: {
        classes: ['quiz', 'hidden'],
        tag: 'section'
    },
    css
};

export default class extends componentType(spec) {

    init(model) {
        super.init();
        this.model = model;
    }

    scrollToCurrentQuestion() {
        const scrollingDiv = this.el.querySelector('.content-row');
        const targetEl = scrollingDiv.children[this.model.currentQuestion];

        targetEl.classList.remove('hidden');
        const scrollEndPosition = targetEl.getBoundingClientRect().left - scrollingDiv.getBoundingClientRect().left;
        const SCROLL_TICKS = 9;
        const stepSize = Math.ceil(scrollEndPosition / SCROLL_TICKS);
        const scrollOneStep = () => {
            const nextPos = scrollingDiv.scrollLeft + stepSize;

            if (nextPos < scrollEndPosition) {
                scrollingDiv.scrollLeft = nextPos;
                window.requestAnimationFrame(scrollOneStep);
            } else {
                scrollingDiv.scrollLeft = scrollEndPosition;
                Array.from(scrollingDiv.children)
                    .forEach((c) => {
                        if (c !== targetEl) {
                            c.classList.add('hidden');
                        }
                    });
            }
        };

        window.requestAnimationFrame(scrollOneStep);
    }

    @on('click .answer')
    selectAnswer(event) {
        const answerEl = event.delegateTarget;
        const siblings = Array.from(answerEl.parentNode.children);
        const selectedIndex = siblings.indexOf(answerEl);
        const correctIndex = this.model.questions[this.model.currentQuestion].correctIndex;

        if (selectedIndex === correctIndex) {
            this.model.currentQuestion += 1;
            this.scrollToCurrentQuestion();
            this.update();
            if (this.model.currentQuestion >= this.model.questions.length) {
                setTimeout(this.model.onComplete, 3000);
            }
        } else {
            answerEl.classList.add('guessed');
        }
    }

    @on('click .skip-link a')
    saveProgressBeforeLeaving(event) {
        this.model.onComplete();
    }

}
