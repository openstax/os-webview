import routerBus from '~/helpers/router-bus';
import React, {useState, useEffect} from 'react';
import useSubjectsContext, {SubjectsContextProvider} from './context';
import {RawHTML, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import BookViewer from './book-viewer/book-viewer';
import categoryPromise from '~/models/subjectCategories';
import savingsPromise from '~/models/savings';
import useSavingsDataIn, {linkClickTracker} from '~/helpers/savings-blurb';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import {forceCheck} from 'react-lazyload';
import './subjects.scss';
import $ from '~/helpers/$';

const pagePath = '/subjects';

function categoryFromPath() {
    return window.location.pathname.replace(/.*subjects/, '').substr(1).toLowerCase() || 'view-all';
}

function useCategoryTiedToPath() {
    const [category, setCategory] = useState(categoryFromPath());
    const categories = useDataFromPromise(categoryPromise, []);
    const {title} = useSubjectsContext();

    useEffect(() => {
        const path = category === 'view-all' ? pagePath : `${pagePath}/${category}`;

        routerBus.emit('navigate', path, {
            filter: category,
            path: pagePath
        });
        window.requestAnimationFrame(forceCheck);
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, [category]);

    useEffect(() => {
        const categoryEntry = categories.find((e) => e.value === category);

        document.title = (categoryEntry && categoryEntry.title) || title;
    }, [category, categories, title]);

    return {category, setCategory, categories};
}

function AboutBlurb({heading, description}) {
    const eventName = 'Microdonation subjects page donor supported blurb impact link';

    return (
        <div className="blurb" onClick={linkClickTracker(eventName)}>
            <h3 className="title">{heading}</h3>
            <RawHTML Tag="p" className="text" html={description} />
        </div>
    );
}

function SavingsBlurb({description}) {
    const eventName = 'Microdonation subjects page bottom sentence impact link';

    return (
        <React.Fragment>
            <hr />
            <div className="text-content" onClick={linkClickTracker(eventName)}>
                <RawHTML Tag="p" className="savings-blurb" html={description} />
            </div>
        </React.Fragment>
    );
}

function useLastBlurb(data) {
    const {adoptions_count: adoptions, savings} = useDataFromPromise(savingsPromise, {});
    const description = useSavingsDataIn(data.description, adoptions, savings);

    if (!data) {
        return false;
    }
    if (data.heading) {
        return {
            heading: data.heading,
            description
        };
    }
    return description;
}

function AboutOurTextBooks() {
    const model = useSubjectsContext();
    const textData = Reflect.ownKeys(model)
        .filter((k) => (/^devStandard\d/).test(k))
        .reduce((a, b) => {
            const [_, num, textId] = b.match(/(\d+)(\w+)/);
            const index = num - 1;

            a[index] = a[index] || {};
            a[index][textId.toLowerCase()] = model[b];
            return a;
        }, []);

    const lastBlurb = useLastBlurb(textData[3]);

    return (
        <div>
            <h2 className="text-content">About Our Textbooks</h2>
            <div className="boxed-row feature-block">
                {
                    textData.slice(0, 3).map((data) =>
                        <AboutBlurb {...data} key={data.description} />)
                }
                {lastBlurb.heading && <AboutBlurb {...lastBlurb} />}
            </div>
            {
                !lastBlurb.heading &&
                    <SavingsBlurb description={lastBlurb} />
            }
        </div>
    );
}

function StripsAndFilter({category, categories, setCategory}) {
    const {filterIsSticky} = useSubjectsContext();

    return (
        <div className="strips-and-filter">
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className={`filter ${filterIsSticky ? 'sticky': ''}`}>
                <RadioPanel selectedItem={category} items={categories} onChange={setCategory} />
            </div>
        </div>
    );
}

function Books({category}) {
    const {books} = useSubjectsContext();

    return (
        <div className="books">
            <div className="boxed container">
                <BookViewer books={books} category={category} />
            </div>
            <AboutOurTextBooks />
        </div>
    );
}

function Subjects() {
    const {pageDescription} = useSubjectsContext();
    const {category, categories, setCategory} = useCategoryTiedToPath();

    useEffect(
        () => $.setPageDescription($.htmlToText(pageDescription)),
        [pageDescription]
    );

    return (
        <React.Fragment>
            <RawHTML className="hero" html={pageDescription} />
            <StripsAndFilter {...{category, categories, setCategory}} />
            <Books category={category} />
        </React.Fragment>
    );
}

export default function SubjectsLoader() {
    return (
        <SubjectsContextProvider>
            <main className="subjects-page">
                <Subjects />
            </main>
        </SubjectsContextProvider>
    );
}
