import {Controller} from 'superb';
import ContentItem from './content-item';

function hasContents(entry) {
    return entry.contents && entry.contents.length;
}

function isUnit(entry) {
    return hasContents(entry) && hasContents(entry.contents[0]);
}

function isPreface(entry) {
    return entry.title.match(/^(?:Preface|Introduction(?!:)|Connection for AP|Thinking Ahead$)/);
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
        const doNumber = (entry) => (!(i === this.startFrom && isPreface(entry)) &&
            (hasContents(entry) || this.parentNumber));

        for (const entry of this.model) {
            let chapterNumber = '';

            // If any entry is a Unit, all are Units (even if some don't look have contents)
            if (isUnit(entry)) {
                isUnitLevel = true;
            } else {
                this.startFrom = 1;
            }
            // Only check preface for first chapter in section
            // Do not number chapters with no contents -- those are appendices
            if (doNumber(entry)) {
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
        }
    }

}
