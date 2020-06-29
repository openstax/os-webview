import React, {useEffect, useRef} from 'react';
import WrappedJsx, {SuperbItem} from '~/controllers/jsx-wrapper';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Bus} from '~/helpers/controller/bus-mixin';
import {Authors, PublicationInfo, ErrataSection} from '../common/common.jsx';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import LetUsKnow from '../let-us-know/let-us-know.jsx';
import TocDrawer from '../table-of-contents/table-of-contents';
import './details-tab.css';

function PolishTab({model, gtt}) {
    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h3>Przejdź do książki</h3>
                    <SuperbItem component={gtt} className="get-the-book" />
                </div>
                <div className="let-us-know-region" skip="true">
                    <LetUsKnow title={model.title} />
                </div>
            </div>
            <div className="main">
                <div className="loc-summary-text">
                    <h3>Podsumowanie</h3>
                    <RawHTML html={model.description} />
                </div>
                <Authors model={model} polish={true} />
                <ErrataSection bookState={model.bookState} blurb={model.errataBlurb} polish={true} />
                <PublicationInfo model={model} polish={true} />
            </div>
        </div>
    );
}

function EnglishTab({model, gtt}) {
    return (
        <div className="details-tab">
            <div className="sidebar">
                <div>
                    <h3>Get the book</h3>
                    <SuperbItem component={gtt} className="get-the-book" />
                </div>
                <div className="let-us-know-region">
                    <LetUsKnow title={model.salesforceAbbreviation} />
                </div>
            </div>
            <div className="main">
                <div className="loc-summary-text">
                    <h3>Summary</h3>
                    <RawHTML html={model.description} />
                </div>
                <Authors model={model} />
                <ErrataSection bookState={model.bookState} blurb={model.errataBlurb} title={model.title} />
                <div className="publication-info">
                    <PublicationInfo model={model} url={null} />
                </div>
            </div>
        </div>
    );
}

export function DetailsTab({polish, ...model}) {
    const {bus, isRex, isTutor, webviewLink, bookInfo} = model;
    const includeTOC = ['live', 'new_edition_available'].includes(bookInfo.book_state);
    const gttArgs = {
        includeTOC,
        isRex,
        isTutor,
        webviewLink,
        ...bookInfo
    };
    const gtt = new GetThisTitle(gttArgs);

    if (includeTOC) {
        gtt.on('toc', (whether) => {
            bus.emit('toc', whether);
        });
        bus.on('put-toc-in', (region) => {
            const tocComponent = new TocDrawer({
                isRex,
                cnxId: bookInfo.cnx_id,
                webviewLink,
                isTutor
            });

            region.attach(tocComponent);
        });
        bus.on('set-toc', (...args) => {
            gtt.emit('set-toc', ...args);
        });
    }

    return polish ? <PolishTab model={model} gtt={gtt} /> : <EnglishTab model={model} gtt={gtt}/>;
}

export default class extends WrappedJsx {

    init(props) {
        const bus = new Bus();

        super.init(DetailsTab, {bus, ...props});
        this.on = bus.on.bind(bus);
        this.emit = bus.emit.bind(bus);
    }

}
