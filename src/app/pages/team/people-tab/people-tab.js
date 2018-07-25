import VERSION from '~/version';
import $ from '~/helpers/$';
import {Controller} from 'superb.js';
import {description as template} from './people-tab.html';
import {on} from '~/helpers/controller/decorators';

export default class PeopleTab extends Controller {

    init(getProps) {
        this.template = template;
        this.getProps = getProps;
        this.view = {
            classes: ['people-tab']
        };
        this.css = `/app/pages/team/people-tab/people-tab.css?${VERSION}`;
        this.model = () => this.getModel();

        this.selectedCard = null;
    }

    getModel() {
        this.props = this.getProps(); // It is an array!
        const result = this.props.slice();

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
        the description directly below the current card. Otherwise, go
        one to the left and below.

        This gets tricky when you are already in the bottom row
    */
    cardBelowOpenCard() {
        const openCard = this.el.querySelector('.card.open');
        const openCardRect = openCard.getBoundingClientRect();
        const followingCards = this.el.querySelectorAll('.card.open ~ :not(.description)');
        const rowLength = this.getRowLength();
        const isEndOfRow = this.selectedCard % rowLength === rowLength - 1;
        const cardToInsertBefore = Array.from(followingCards)
            .filter((c) => {
                const r = c.getBoundingClientRect();

                return r.top > openCardRect.top && r.left <= openCardRect.left;
            })
            .slice(0, rowLength)
            .slice(isEndOfRow ? -2 : -1)[0];

        return cardToInsertBefore;
    }

    onUpdate() {
        if (this.selectedCard) {
            const descriptionCard = this.el.querySelector('.card.description');
            const cardToInsertBefore = this.cardBelowOpenCard();

            descriptionCard.parentNode.insertBefore(descriptionCard, cardToInsertBefore);
        }
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
