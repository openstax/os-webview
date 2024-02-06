import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import useOptimizedImage from '~/helpers/use-optimized-image';
import {Tabs, Item} from '~/components/tablist/tablist';
import './features.scss';

function Feature({name}) {
    return <div className='feature'>{name}</div>;
}

function FeatureList({featureList, exploreLink}) {
    return (
        <div className='feature-list'>
            {featureList?.map((f) => (
                <Feature key={f} name={f} />
            ))}
            <a className='feature explore' href={exploreLink}>
                <span>Explore now</span>&nbsp;
                <FontAwesomeIcon icon={faArrowRight} />
            </a>
        </div>
    );
}

export default function Features({data}) {
    const bgImage = useOptimizedImage(data.bgImage, 570);

    return (
        <section className='features'>
            <img className='right-bg' src={bgImage} alt />
            <div className='boxed text-block'>
                <h2>{data.headline}</h2>
                <Tabs aria-label='Features' defaultSelectedKey='instructors'>
                    <Item key='instructors' title={data.tab1Heading}>
                        <FeatureList
                            featureList={data.tab1Features}
                            exploreLink={data.tab1ExploreUrl}
                        />
                    </Item>
                    <Item key='students' title={data.tab2Heading}>
                        <FeatureList
                            featureList={data.tab2Features}
                            exploreLink={data.tab2ExploreUrl}
                        />
                    </Item>
                </Tabs>
            </div>
        </section>
    );
}
