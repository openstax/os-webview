import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {Authors, PublicationInfo} from '../../common/common';
import CollapsingPane from '~/components/collapsing-pane/collapsing-pane.jsx';
import SavingsBlurb from '../../common/savings-blurb';
import './details-pane.scss';

export default function DetailsPane({polish, model}) {
    return (
        <div className="details-pane">
            <RawHTML html={model.description} />
            <hr className="thin-rule" />
            {model.adoptions && <SavingsBlurb model={model} />}
            <div className="authors-region">
                <CollapsingPane title={polish ? 'Autorzy' : 'Authors'}>
                    <Authors model={model} polish={polish} />
                </CollapsingPane>
            </div>
            <div className="product-details-region">
                <CollapsingPane title={polish ? 'Szczegóły Produktu' : 'Product details'}>
                    <PublicationInfo model={model} polish={polish} />
                </CollapsingPane>
            </div>
        </div>
    );
}
