import {Controller} from 'superb.js';
import ContentItem from './content-item';

function hasContents(entry) {
    return entry.contents && entry.contents.length;
}

function isUnit(entry) {
    return hasContents(entry) && hasContents(entry.contents[0]);
}

export default class Contents extends Controller {

    init(data, view) {
        this.template = () => '';
        this.view = view;
        this.model = data.contents;
        this.parentNumber = data.number ? `${data.number}.` : '';
        this.startFrom = data.startFrom || 1;
    }

    onLoaded() {
        let i=this.startFrom;
        let isUnitLevel = false;
        const computeStartFrom = (entry) => {
            if (isUnitLevel && isUnit(entry)) {
                this.startFrom += entry.contents.length;
            }
        };
        const doNumber = (entry, index) =>
            hasContents(entry) ||
            (index > 0 && this.parentNumber);

        this.model.forEach((entry, index) => {
            let chapterNumber = '';

            // If any entry is a Unit, all are Units (even if some don't look have contents)
            if (isUnit(entry)) {
                isUnitLevel = true;
            } else if (hasContents(entry)) {
                this.startFrom = 1;
            }

            if (doNumber(entry, index)) {
                chapterNumber = `${this.parentNumber}${i}`;
                ++i;
            }
            this.regions.self.append(new ContentItem({
                model: entry,
                number: isUnitLevel ? '' : chapterNumber,
                tag: 'li',
                startFrom: this.startFrom
            }));
            computeStartFrom(entry);
        });
    }

}
