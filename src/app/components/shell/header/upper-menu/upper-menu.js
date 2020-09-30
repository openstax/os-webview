import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {useDataFromSlug, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import useGiveToday from '~/models/give-today';
import './upper-menu.css';

function BlogItem() {
    const data = useDataFromSlug('openstax-news');
    const shouldDisplay = data && Reflect.has(data, 'articles') &&
        Object.keys(data.articles).length;

    if (!shouldDisplay) {
        return null;
    }
    return (
        <a className="nav-menu" href="/blog">Blog</a>
    );
}

function GiveItem() {
    const giveData = useGiveToday();

    if (giveData.showButton) {
        return null;
    }
    return (
        <a className="nav-menu" href="/give" target="_blank" rel="noreferrer">Give</a>
    );
}

function UpperMenu() {
    return (
        <React.Fragment>
            <a className="nav-menu" href="/bookstore-suppliers">Bookstores</a>
            <a className="nav-menu" href="/impact">Our Impact</a>
            <a className="nav-menu" href="/foundation">Supporters</a>
            <BlogItem />
            <GiveItem />
            <a className="nav-menu" href="https://openstax.secure.force.com/help">Help</a>
            <a className="logo rice-logo logo-wrapper" href="http://www.rice.edu">
                <img src="/images/rice.png" alt="Rice University logo" height="30" />
            </a>
        </React.Fragment>
    );
}

const view = {
    classes: ['container']
};

export default pageWrapper(UpperMenu, view);


// export default class UpperMenu extends Controller {
//
//     init() {
//         this.template = template;
//         this.view = {
//             classes: ['container']
//         };
//         this.css = css;
//         this.model = {};
//
//         /* eslint arrow-parens: 0 */
//         (async () => {
//             try {
//                 const data = await cmsFetch('pages/openstax-news');
//
//                 if (Reflect.has(data, 'articles') && Object.keys(data.articles).length) {
//                     this.model.showBlog = true;
//                     this.update();
//                 }
//             } catch (e) {
//                 console.log(e);
//             }
//         })();
//     }
//
// }
