import BaseView from '~/helpers/backbone/view';
import LoadingView from '~/helpers/backbone/loading-view';
import BaseModel from '~/helpers/backbone/model';
import {props} from '~/helpers/backbone/decorators';
import {template} from './adopters.hbs';
import {template as columnTemplate} from './adopter-column.hbs';
import settings from 'settings';

let adopterPromise = (new BaseModel()).fetch({url: `${settings.apiOrigin}/api/adopters`});

@props({
    template: columnTemplate,
    css: '/app/pages/adopters/adopters.css'
})
class AdopterColumn extends BaseView {
    constructor(nameList) {
        super();
        this.templateHelpers = {
            names: nameList
        };
    }

    onRender() {
        this.el.classList.add('adopter-column');
    }
}

function makeColumns(list, columnCount) {
    let perColumn = Math.ceil(list.length / columnCount),
        views = [];

    for (let col = 0; col < columnCount; ++col) {
        let begin = col * perColumn,
            end = begin + perColumn;

        views.push(new AdopterColumn(list.slice(begin, end)));
    }
    return views;
}

@props({
    template,
    regions: {
        adopters: '.adopters'
    }
})
export default class Adopters extends LoadingView {
    onRender() {
        for (let el of Array.from(this.el.querySelectorAll('*'))) {
            el.classList.add('hidden');
        }
        super.onRender();
        this.el.classList.add('adopters-page', 'text-content');
        this.otherPromises.push(new Promise((resolve) => {
            adopterPromise.then((data) => {
                let sortedNames = data.map((obj) => obj.name).sort(),
                    views = makeColumns(sortedNames, 4);

                for (let view of views) {
                    this.regions.adopters.append(view);
                    view.el.classList.add('four-column');
                }

                views = makeColumns(sortedNames, 3);
                for (let view of views) {
                    this.regions.adopters.append(view);
                    view.el.classList.add('three-column');
                }

                let view = new AdopterColumn(sortedNames);

                this.regions.adopters.append(view);
                view.el.classList.add('one-column');
                resolve();
            });
        }));
    }

    onLoaded() {
        super.onLoaded();
        for (let el of Array.from(this.el.querySelectorAll('.hidden'))) {
            el.classList.remove('hidden');
        }
    }
}
