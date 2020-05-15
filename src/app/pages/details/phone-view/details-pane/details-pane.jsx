import React, {useState, useEffect} from 'react';
import {Authors, PublicationInfo} from '../../common/common.jsx';
import CollapsingPane from '~/components/collapsing-pane/collapsing-pane.jsx';
import WrappedJsx from '~/controllers/jsx-wrapper';
import './details-pane.css';

export function DetailsPane({model}) {
    const {polish} = model;

    return (
        <div className="details-pane">
            <div dangerouslySetInnerHTML={{__html: model.description}} />
            <div class="authors-region">
                <CollapsingPane title={polish ? 'Autorzy' : 'Authors'}>
                    <Authors model={model} polish={polish} />
                </CollapsingPane>
            </div>
            <div class="product-details-region">
                <CollapsingPane title={polish ? 'Szczegóły Produktu' : 'Product details'}>
                    <PublicationInfo model={model} polish={polish} />
                </CollapsingPane>
            </div>
        </div>
    );
}

export default class extends WrappedJsx {

    init(model) {
        super.init(DetailsPane, {model});
    }

}
