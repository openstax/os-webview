import React from 'react';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRightLong} from '@fortawesome/free-solid-svg-icons/faRightLong';
import uniq from 'lodash/uniq';
import './subjects.scss';

function Card({data}) {
    const style = {backgroundImage: `url(${data.image})`};

    return (
        <div className={`card ${data.color}`}>
            <div className="picture-stripe" style={style} />
            <div className="name-stripe">
                {data.title}
            </div>
            <a className="link-stripe" href={data.link}>
                <FontAwesomeIcon icon={faRightLong} />
            </a>
        </div>
    );
}

function BookCardsGrid({data}) {
    return (
        <div className="book-cards-grid">
            {
                data.map((b) => <Card key={b.title} data={b} />)
            }
        </div>
    );
}

function FilteringGrid({data}) {
    const k12titles = React.useMemo(
        () => Reflect.ownKeys(data).map(
            (k) => ({
                title: k,
                ...data[k]
            })
        ),
        [data]
    );
    const k12cats = React.useMemo(
        () => uniq(k12titles.map((item) => item.subjectCategory)),
        [k12titles]
    );
    const radioItems = React.useMemo(
        () => [
            {value: '', html: 'All'},
            ...(
                k12cats
                    .map(
                        (cat) => ({
                            value: cat,
                            html: cat
                        })
                    )
            )
        ],
        [k12cats]
    );
    const [selectedFilter, setSelectedFilter] = React.useState(radioItems[0].value);
    const matchingTitles = React.useMemo(
        () => selectedFilter === '' ?
            k12titles :
            k12titles.filter(
                (t) => t.subjectCategory === selectedFilter
            )
        ,
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

export default function Subjects({data}) {
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
