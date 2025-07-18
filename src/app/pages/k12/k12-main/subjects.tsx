import React from 'react';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRightLong} from '@fortawesome/free-solid-svg-icons/faRightLong';
import useOptimizedImage from '~/helpers/use-optimized-image';
import uniq from 'lodash/uniq';
import './subjects.scss';
import {K12Data} from './k12-main';

type CardData = K12Data['k12library'][0] & {title: string};

function Card({data}: {data: CardData}) {
    const optimizedImage = useOptimizedImage(data.image, 600);
    const style = {backgroundImage: `url(${optimizedImage})`};
    const fixedLink = data.link.replace(/^\/*/, '/'); // ensure one leading slash

    return (
        <a href={fixedLink} className={`card ${data.color}`}>
            <div className="picture-stripe" style={style} />
            <div className="name-stripe">{data.title}</div>
            <div className="link-stripe">
                <FontAwesomeIcon icon={faRightLong} />
            </div>
        </a>
    );
}

function BookCardsGrid({data}: {data: CardData[]}) {
    return (
        <div className="book-cards-grid">
            {data.map((b) => (
                <Card key={b.title} data={b} />
            ))}
        </div>
    );
}

function FilteringGrid({data}: {data: K12Data['k12library']}) {
    const k12titles = React.useMemo(
        () =>
            Object.entries(data).map(([title, valueObject]) => ({
                title,
                ...valueObject
            })),
        [data]
    );
    const k12cats = React.useMemo(
        () => uniq(k12titles.map((item) => item.subjectCategory)),
        [k12titles]
    );
    const radioItems = React.useMemo(
        () => [
            {value: '', html: 'All'},
            ...k12cats.map((cat) => ({
                value: cat,
                html: cat
            }))
        ],
        [k12cats]
    );
    const [selectedFilter, setSelectedFilter] = React.useState(
        radioItems[0].value
    );
    const matchingTitles = React.useMemo(
        () =>
            selectedFilter === ''
                ? k12titles
                : k12titles.filter((t) => t.subjectCategory === selectedFilter),
        [selectedFilter, k12titles]
    );

    return (
        <div className="filtering-grid boxed">
            <RadioPanel
                items={radioItems}
                selectedItem={selectedFilter}
                onChange={setSelectedFilter}
            />
            <BookCardsGrid data={matchingTitles} />
        </div>
    );
}

export default function Subjects({data}: {data: K12Data}) {
    return (
        <section className="subjects">
            <div className="header boxed">
                <div className="content">
                    <div className="text-content">
                        <h1>{data.subjectLibraryHeader}</h1>
                        <p>{data.subjectLibraryDescription}</p>
                    </div>
                </div>
            </div>
            <FilteringGrid data={data.k12library} />
        </section>
    );
}
