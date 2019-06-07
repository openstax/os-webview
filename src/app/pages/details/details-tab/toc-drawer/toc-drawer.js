import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import Contents from '~/pages/details/contents/contents';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './toc-drawer.html';
import css from './toc-drawer.css';

const spec = {
    template,
    css,
    view: {
        classes: ['toc-drawer']
    }
};

export default class extends componentType(spec, busMixin) {

    onLoaded() {
        const contentPane = new Contents(
            this.data,
            {tag: 'ol', classes: ['table-of-contents']}
        );

        this.regionFrom('.toc-container').append(contentPane);
    }

    @on('click .close-toc')
    closeToc() {
        this.emit('close-toc');
    }

}
