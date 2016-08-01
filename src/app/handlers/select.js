import Select from '~/components/select/select';

class SelectHandler {

    constructor() {
        this.controllers = [];

        window.addEventListener('click', () => {
            this.closeDropdowns();
        });
    }

    setup(el) {
        const selects = el.querySelectorAll('select');

        for (const select of selects) {
            this.controllers.push(new Select({
                select,
                placeholder: select.previousSibling
            }, this));
        }
    }

    closeDropdowns() {
        let i = this.controllers.length;

        while (i--) {
            const controller = this.controllers[i];

            if (document.body.contains(controller.select)) {
                controller.closeDropdown();
            } else {
                this.controllers.splice(i, 1);
            }
        }
    }

    stopScrolling(el) {
        window.onwheel = window.ontouchmove = (e) => {
            const delta = e.wheelDelta || -e.detail;

            e.preventDefault();
            el.scrollTop += (delta < 0 ? 1 : -1) * 30;
        };
    }

    startScrolling() {
        window.onwheel = window.ontouchmove = null;
    }

}

const selectHandler = new SelectHandler();

export default selectHandler;
