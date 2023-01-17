import React from 'react';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRightLong} from '@fortawesome/free-solid-svg-icons/faRightLong';
import './subjects.scss';

const radioItems = [
    {value: '', html: 'All'},
    {value: 'math', html: 'Math'},
    {value: 'science', html: 'Science'},
    {value: 'social-studies', html: 'Social Studies'},
    {value: 'career', html: 'Career &amp; College Readiness'}
];

const matchingSubcats = [
    {
        name: 'Algebra',
        link: '',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        color: 'light-blue'
    },
    {
        name: 'Algebra2',
        link: '',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        color: 'orange'
    },
    {
        name: 'Algebra3',
        link: '',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        color: 'green'
    },
    {
        name: 'Algebra4',
        link: '',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        color: 'yellow'
    },
    {
        name: 'Algebra5',
        link: '',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        color: 'blue'
    },
    {
        name: 'Algebra6',
        link: '',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        color: 'gray'
    }
];

function Card({data}) {
    const style = {backgroundImage: `url(${data.image})`};

    return (
        <div className={`card ${data.color}`}>
            <div className="picture-stripe" style={style} />
            <div className="name-stripe">
                {data.name}
            </div>
            <a className="link-stripe" href={data.link}>
                <FontAwesomeIcon icon={faRightLong} />
            </a>
        </div>
    );
}

function BookCardsGrid() {
    return (
        <div className="book-cards-grid">
            {
                matchingSubcats.map((b) => <Card key={b.name} data={b} />)
            }
        </div>
    );
}

function FilteringGrid() {
    const [selectedFilter, setselectedFilter] = React.useState(radioItems[0].value);
    const onChange = React.useCallback(
        (newlySelectedValue) => {
            setselectedFilter(newlySelectedValue);
        },
        []
    );

    return (
        <div className="filtering-grid boxed">
            <RadioPanel
                items={radioItems}
                selectedItem={selectedFilter}
                onChange={onChange}
            />
            <BookCardsGrid />
        </div>
    );
}

export default function Subjects() {
    const heading = 'Find your subject';
    const text = `
        Adopting an OpenStax textbook for your high school class is simple and
        stress-free. Our peer-reviewed textbooks cover a wide range of disciplines,
        from biology to psychology to sociology. Find your subject below to uncover
        all that OpenStax has to offer.
    `;

    return (
        <section className="subjects">
            <div className="header boxed">
                <div className="content">
                    <div className="text-content">
                        <h1>{heading}</h1>
                        <p>{text}</p>
                    </div>
                </div>
            </div>
            <FilteringGrid />
        </section>
    );
}
