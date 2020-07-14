import routerBus from '~/helpers/router-bus';
import React, {useState, useEffect} from 'react';
import {pageWrapper, SuperbItem} from '~/controllers/jsx-wrapper';
import {usePageData} from '~/helpers/controller/cms-mixin';
import {RawHTML, useResultOfPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import BookViewer from './book-viewer/book-viewer';
import categoryPromise from '~/models/subjectCategories';
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

function Subjects({model}) {
    const category = useCategoryTiedToPath();
    const categories = useResultOfPromise(categoryPromise, []);

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
        dev_standard_1_heading: blurbHeading1,
        dev_standard_1_description: blurbDescription1,
        dev_standard_2_heading: blurbHeading2,
        dev_standard_2_description: blurbDescription2,
        dev_standard_3_heading: blurbHeading3,
        dev_standard_3_description: blurbDescription3,
        books
    } = model;

    return (
        <React.Fragment>
            <RawHTML className="hero" html={heroHtml} />

            <div className="strips-and-filter">
                <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
                <div className={`filter ${model.filterIsSticky ? 'sticky': ''}`}>
                    <RadioPanel2 selectedItem={category} items={categories} onChange={setCategory} />
                </div>
            </div>
            <div className="books">
                <div className="boxed container">
                    <BookViewer books={books} category={category} />
                </div>
                <div>
                    <h2 className="text-content">About Our Textbooks</h2>
                    {
                        blurbHeading1 &&
                            <div className="boxed-row feature-block">
                                <div className="blurb">
                                    <h3 className="title">{blurbHeading1}</h3>
                                    <RawHTML Tag="p" className="text" html={blurbDescription1} />
                                </div>
                                <div className="blurb">
                                    <h3 className="title">{model.dev_standard_2_heading}</h3>
                                    <RawHTML Tag="p" className="text" html={blurbDescription2} />
                                </div>
                                <div className="blurb">
                                    <h3 className="title">{model.dev_standard_2_heading}</h3>
                                    <RawHTML Tag="p" className="text" html={blurbDescription3} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

function SubjectsLoader() {
    const slug = 'books';
    const [model, statusPage] = usePageData({slug, preserveWrapping: true});

    return statusPage ? statusPage : <Subjects model={model} />;
}

const view = {
    classes: ['subjects-page'],
    tag: 'main'
};

export default pageWrapper(SubjectsLoader, view);
