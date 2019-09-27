import componentType from '~/helpers/controller/init-mixin';
import Contents from '~/pages/details/contents2/contents';

const spec = {
    view: {
        classes: ['toc-drawer']
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        const contentPane = new Contents({
            cnxId: this.data.id,
            slug: this.data.slug
        });

        this.regions.self.append(contentPane);
    }

}
