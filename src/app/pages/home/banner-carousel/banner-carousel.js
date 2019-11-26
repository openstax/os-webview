import analytics from '~/helpers/analytics';
import componentType from '~/helpers/controller/init-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './banner-carousel.html';
import css from './banner-carousel.css';
import $ from '~/helpers/$';

function whenLoaded(imgUrl, callback) {
    let img = document.createElement('img');

    img.src = imgUrl;
    img.addEventListener('load', () => {
        callback();
        img = null;
    });
}

const spec = {
    template,
    css,
    view: {
        classes: ['banner-carousel']
    },
    model() {
        const props = this.getProps();

        this.images = ($.isMobileDisplay() ? props.smallImages : props.largeImages);
        if (!this.allLoaded) {
            this.images = this.images.map((obj, index) =>
                (index > 0) ? Object.assign({}, obj, {image: ''}) : obj
            );
        }
        return {
            images: this.images,
            frameNumber: this.frameNumber
        };
    }
};
const BaseClass = componentType(spec);

export default class BannerCarousel extends BaseClass {

    init(getProps) {
        super.init();
        this.getProps = getProps;
        this.frameNumber = 0;
    }

    onAttached() {
        if (super.onAttached) {
            super.onAttached();
        }
        this.onResize = () => this.update();
        whenLoaded(this.images[0].image, () => {
            this.allLoaded = true;
            window.addEventListener('resize', this.onResize);
        });
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        window.removeEventListener('resize', this.onResize);
    }

    @on('click .image-row a')
    reportImageClick() {
        const imageData = this.images[this.frameNumber];
        const identifier = imageData.identifier || imageData.image.replace(/.*\//, '');

        analytics.sendPageEvent(
            'Homepage banner',
            'click',
            identifier
        );
    }

    @on('click .dot')
    handleDotClick(event) {
        const f = event.target.getAttribute('data-index');

        this.changeFrame(f);
    }

    @on('click .left-arrow')
    handleLeftClick() {
        this.changeFrame(Number(this.frameNumber) - 1);
    }

    @on('click .right-arrow')
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
                oldFrameNumber
            });
        }
    }

}
