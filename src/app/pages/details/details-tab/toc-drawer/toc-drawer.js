import componentType from '~/helpers/controller/init-mixin';
import Contents from '~/pages/details/contents/contents';

const spec = {
    view: {
        classes: ['toc-drawer']
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        const contentPane = new Contents(
            this.data,
            {tag: 'ol', classes: ['table-of-contents']}
        );

        this.regions.self.append(contentPane);
    }

}
