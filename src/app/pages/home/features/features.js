import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import './features.scss';

function RadioItem({item, selectedItem, changeItem}) {
    const checked = selectedItem === item;

    return (
        <div role="radio" onClick={() => changeItem(item)} aria-checked={checked}>
            {item}
        </div>
    );
}

function RadioGroup({items, selectedItem, changeItem}) {
    return (
        <div role="radiogroup" className="custom">
            {
                items.map((item) =>
                    <RadioItem key={item} {...{item, selectedItem, changeItem}} />
                )
            }
        </div>
    );
}

function Feature({name}) {
    return (
        <div className="feature">{name}</div>
    );
}

export default function Features({data}) {
    const [selectedItem, setSelectedItem] = React.useState(data.tab1Heading);
    const [featureList, exploreLink] = selectedItem === data.tab1Heading ?
        [data.tab1Features, data.tab1ExploreUrl] :
        [data.tab2Features, data.tab2ExploreUrl];

    return (
        <section className="features">
            <img className="right-bg" src={data.bgImage} alt />
            <div className="boxed text-block">
                <h2>{data.headline}</h2>
                <RadioGroup
                    selectedItem={selectedItem}
                    items={[data.tab1Heading, data.tab2Heading]}
                    changeItem={setSelectedItem}
                />
                <div className="feature-list">
                    {
                        featureList.map((f) => <Feature key={f} name={f} />)
                    }
                    <a className="feature explore" href={exploreLink}>
                        <span>Explore now</span>&nbsp;
                        <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                </div>
            </div>
        </section>
    );
}
