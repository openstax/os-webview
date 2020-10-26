import routerBus from '~/helpers/router-bus';
import React, {useState, useEffect} from 'react';
import {pageWrapper, SuperbItem} from '~/controllers/jsx-wrapper';
import {usePageData} from '~/helpers/controller/cms-mixin';
import {RawHTML, useDataFromPromise, useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import BookViewer from './book-viewer/book-viewer';
import categoryPromise from '~/models/subjectCategories';
import savingsPromise from '~/models/savings';
import useSavingsDataIn, {linkClickTracker} from '~/helpers/savings-blurb';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import './subjects.css';
import $ from '~/helpers/$';

const pagePath = '/subjects';

function categoryFromPath() {
    return window.location.pathname.replace(/.*subjects/, '').substr(1).toLowerCase() || 'view-all';
}

function useCategoryTiedToPath() {
    const [category, setCategory] = useState(categoryFromPath());

    useEffect(() => {
        const setIt = () => {
            setCategory(categoryFromPath());
        };

        window.addEventListener('popstate', setIt);
        return () => window.removeEventListener('popstate', setIt);
    }, []);

    return category;
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

function AboutOurTextBooks({model}) {
    const textData = Reflect.ownKeys(model)
        .filter((k) => k.startsWith('dev_standard_'))
        .reduce((a, b) => {
            const [_, num, textId] = b.match(/(\d+)_(\w+)/);
            const index = num - 1;

            a[index] = a[index] || {};
            a[index][textId] = model[b];
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

function Subjects({model}) {
    const category = useCategoryTiedToPath();
    const categories = useDataFromPromise(categoryPromise, []);

    useEffect(() => {
        const description = $.htmlToText(model.page_description);

        $.setPageDescription(description);
    }, [model]);

    function setCategory(newCategory) {
        const categoryEntry = categories.find((e) => e.value === newCategory);
        const path = newCategory === 'view-all' ? pagePath : `${pagePath}/${newCategory}`;

        routerBus.emit('navigate', path, {
            filter: newCategory,
            path: pagePath
        });
        document.title = (categoryEntry && 'title' in categoryEntry) ? categoryEntry.title : model.title;
    }

    const {
        page_description: heroHtml,
        books
    } = model;

    return (
        <React.Fragment>
            <RawHTML className="hero" html={heroHtml} />

            <div className="strips-and-filter">
                <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
                <div className={`filter ${model.filterIsSticky ? 'sticky': ''}`}>
                    <RadioPanel selectedItem={category} items={categories} onChange={setCategory} />
                </div>
            </div>
            <div className="books">
                <div className="boxed container">
                    <BookViewer books={books} category={category} />
                </div>
                <AboutOurTextBooks model={model} />
            </div>
        </React.Fragment>
    );
}

function SubjectsLoader() {
    const slug = 'books';
    const [model, statusPage] = usePageData({slug, preserveWrapping: true});

    useCanonicalLink();

    if (statusPage) {
        return statusPage;
    }

    model.books = model.books.filter((b) => b.book_state !== 'retired');

    return <Subjects model={model} />;
}

const view = {
    classes: ['subjects-page'],
    tag: 'main'
};

export default pageWrapper(SubjectsLoader, view);
