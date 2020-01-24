import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './partners.html';
import css from './partners.css';
import {on} from '~/helpers/controller/decorators';
import routerBus from '~/helpers/router-bus';

const spec = {
    template,
    css,
    view: {
        classes: ['partners']
    }
};

class Partners extends componentType(spec) {

    @on('click .filter-for-book')
    saveBookInHistoryState(event) {
        const destUrl = event.delegateTarget.getAttribute('href');

        routerBus.emit('navigate', destUrl, {
            book: this.bookAbbreviation
        }, true);
    }

}

export default function ({dataPromise, targetEl, allies, bookAbbreviation}) {
    dataPromise.then((pd) => {
        function allyToPartner(ally) {
            const partner = pd.find((pEntry) => pEntry.partner_name === ally.ally_heading) || {};

            return {
                image: ally.ally_color_logo,
                name: ally.ally_heading,
                description: ally.ally_short_description,
                cost: partner.affordability_cost,
                type: partner.partner_type,
                url: `/partner-marketplace?${ally.ally_heading}`
            };
        }

        const p = new Partners({
            el: targetEl,
            bookAbbreviation,
            model: {
                title: pd.partner_list_label || '[Courseware partners]',
                blurbs: allies
                    .sort((a, b) => a.ally_heading.localeCompare(b.ally_heading))
                    .map(allyToPartner)
            }
        });
    });
}
