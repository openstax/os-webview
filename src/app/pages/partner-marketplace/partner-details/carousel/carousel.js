import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './carousel.html';
import css from './carousel.css';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['carousel']
    },
    model() {
        return {
            frameNumber: this.frameNumber,
            images: this.images
        };
    },
    frameNumber: 0,
    images: [
        'https://via.placeholder.com/250x150?text=img-1',
        'https://via.placeholder.com/250x150?text=2nd',
        'https://via.placeholder.com/250x150?text=3rd'
    ]
};

export default class extends componentType(spec) {

    @on('click .navigate.previous')
    handleLeftClick() {
        this.changeFrame(Number(this.frameNumber) - 1);
    }

    @on('click .navigate.next')
    handleRightClick(event) {
        this.changeFrame(Number(this.frameNumber) + 1);
    }

    changeFrame(newFrameNumber) {
        const oldFrameNumber = Number(this.frameNumber);

        this.frameNumber = newFrameNumber;
        this.update();
        if (this.frameNumber >= 0 && this.frameNumber < this.images.length) {
            $.scrollToFrame({
                divEl: this.el.querySelector('.image-row'),
                newFrameNumber,
                oldFrameNumber,
                unit: '%'
            });
        }
    }

}
