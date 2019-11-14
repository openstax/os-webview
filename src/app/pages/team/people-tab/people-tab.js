import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import {description as template} from './people-tab.html';
import css from './people-tab.css';
import {on} from '~/helpers/controller/decorators';

export default class PeopleTab extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['people-tab']
        };
        this.css = css;
        this.model = () => this.getModel();

        this.selectedCard = null;
    }

    getModel() {
        this.props = this.getProps(); // It is an array!
        const result = this.props.map((p) => p.value);

        // This is a little hacky, but we need spacers to fill out one row
        // beyond the open card. Row length depends on window size
        if (this.selectedCard) {
            const rowLength = this.getRowLength();

            result.spacerCount = Math.max(
                rowLength - (result.length - this.selectedCard - 1),
                0
            );
            result.isEndOfRow = (this.selectedCard % rowLength) === rowLength - 1;
        }

        result.selectedCard = this.selectedCard;
        return result;
    }

    getRowLength() {
        const rowOfThree = window.getComputedStyle(this.el.querySelector('.row-of-three')).display !== 'none';
        const rowOfFour = window.getComputedStyle(this.el.querySelector('.row-of-four')).display !== 'none';

        if (rowOfThree) {
            return 3;
        }

        if (rowOfFour) {
            return 4;
        }

        return 1;
    }

    /*
        If there is space to the right of the open card, then insert
        the bio directly below the current card. Otherwise, go
        one to the left and below.

        This gets tricky when you are already in the bottom row
    */
    cardBelowOpenCard() {
        const openCard = this.el.querySelector('.card.open');
        const openCardRect = openCard.getBoundingClientRect();
        const followingCards = this.el.querySelectorAll('.card.open ~ :not(.bio)');
        const rowLength = this.getRowLength();
        const isEndOfRow = this.selectedCard % rowLength === rowLength - 1;
        const cardToInsertBefore = Array.from(followingCards)
            .slice(0, rowLength)
            .filter((c) => {
                const r = c.getBoundingClientRect();

                return r.top > openCardRect.top && r.left <= openCardRect.left;
            })
            .slice(isEndOfRow ? -2 : -1)[0];

        return cardToInsertBefore;
    }

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
        if (this.selectedCard) {
            const bioCard = this.el.querySelector('.card.bio');
            const cardToInsertBefore = this.cardBelowOpenCard();

            bioCard.parentNode.insertBefore(bioCard, cardToInsertBefore);
        }
        const anyTitles = this.model().some((e) => e.title);

        this.el.classList.toggle('inline-bios', !anyTitles);
    }

    @on('click [role="button"]')
    setSelectedCard(event) {
        const clickedIndex = event.delegateTarget.getAttribute('data-index');

        this.selectedCard = (this.selectedCard === clickedIndex) ? null : clickedIndex;
        this.update();
    }

    @on('click .put-away')
    clearSelectedCard() {
        this.selectedCard = null;
        this.update();
    }

}
