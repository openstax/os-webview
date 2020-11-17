import React, {useState, useEffect} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Authors, PublicationInfo} from '../../common/common';
import CollapsingPane from '~/components/collapsing-pane/collapsing-pane.jsx';
import SavingsBlurb from '../../common/savings-blurb';
import WrappedJsx from '~/controllers/jsx-wrapper';
import './details-pane.css';

export default function DetailsPane({polish, model}) {
    return (
        <div className="details-pane">
            <RawHTML html={model.description} />
            <hr className="thin-rule" />
            {model.adoptions && <SavingsBlurb model={model} />}
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
