export default class TouchScroller {
    start(element, e) {
        this.element = element;
        this.touchStartY = e.changedTouches[0].pageY;
        this.elementStartY = element.scrollTop;
    }

    scroll(e) {
        let newY = e.targetTouches[0].pageY,
            diff = this.touchStartY - newY;

        this.element.scrollTop = this.elementStartY + diff;
        e.preventDefault();
        e.stopPropagation();
    }
}
