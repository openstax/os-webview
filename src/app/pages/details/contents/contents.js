import {Controller} from 'superb';
import ContentItem from './content-item';

function hasContents(entry) {
    return entry.contents && entry.contents.length;
}

function isUnit(entry) {
    return hasContents(entry) && hasContents(entry.contents[0]);
}

function isPreface(entry) {
    return entry.title.match(/Preface/);
}

export default class Contents extends Controller {

    init(data, view) {
        this.template = () => '';
        this.view = view;
        this.model = data.contents;
        this.parentNumber = data.number ? `${data.number}.` : '';
    }

    onLoaded() {
        let i=0;

        for (const entry of this.model) {
            let chapterNumber = '';

            if (!isPreface(entry)) {
                ++i;
                chapterNumber = `${this.parentNumber}${i}`;
            }

            this.regions.self.append(new ContentItem(entry, isUnit(entry) ? '' : chapterNumber, 'li'));
        }
    }

}
