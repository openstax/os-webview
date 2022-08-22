import React, {useState, useEffect} from 'react';
import useSubjectsContext, {SubjectsContextProvider} from './context';
import useSubjectCategoryContext from '~/contexts/subject-category';
import {RawHTML, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FormattedMessage} from 'react-intl';
import BookViewer from './book-viewer/book-viewer';
import savingsPromise from '~/models/savings';
import useSavingsDataIn, {linkClickTracker} from '~/helpers/savings-blurb';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import {forceCheck} from 'react-lazyload';
import LanguageSelector from '~/components/language-selector/language-selector';
import {useLocation, useNavigate} from 'react-router-dom';
import './subjects.scss';
import $ from '~/helpers/$';

const pagePath = '/subjects';

function categoryFromPath() {
    return window.location.pathname.replace(/.*subjects/, '').substr(1).toLowerCase() || 'view-all';
}

function useCategoryTiedToPath() {
    const [category, setCategory] = useState(categoryFromPath());
    const categories = useSubjectCategoryContext();
    const {title} = useSubjectsContext();
    const {pathname} = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const path = category === 'view-all' ? pagePath : `${pagePath}/${category}`;

        navigate(path, {
            filter: category,
            path: pagePath
        });
        window.requestAnimationFrame(forceCheck);
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, [category, navigate]);

    useEffect(() => {
        const categoryEntry = categories.find((e) => e.value === category);

        if (!categoryEntry && categories.length > 0) {
            setCategory(categories[0].value);
        } else {
            document.title = (categoryEntry?.title) || title;
        }
    }, [category, categories, title]);

    useEffect(() => {
        setCategory(categoryFromPath());
    }, [pathname]);

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
            <h2 className="text-content">{model.devStandardsHeading}</h2>
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


function StripsAndFilter({category, setCategory}) {
    const categories = useSubjectCategoryContext();
    const {filterIsSticky} = useSubjectsContext();

    return (
        <div className="strips-and-filter">
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="presentation" />
            <div className={`filter ${filterIsSticky ? 'sticky': ''}`}>
                <RadioPanel selectedItem={category} items={categories} onChange={setCategory} />
            </div>
        </div>
    );
}

function Books({category}) {
    return (
        <div className="books">
            <div className="boxed container">
                <BookViewer category={category} />
            </div>
            <AboutOurTextBooks />
        </div>
    );
}

function LeadIn() {
    return (
        <FormattedMessage id="weHaveBooksIn" defaultMessage="We have textbooks in" />
    );
}

function Subjects() {
    const {pageDescription, translations} = useSubjectsContext();
    const {category, setCategory} = useCategoryTiedToPath();
    const otherLocales = translations.length ?
        translations[0].value.map((t) => t.locale).filter((l) => Boolean(l)) :
        []
    ;

    useEffect(
        () => $.setPageDescription($.htmlToText(pageDescription)),
        [pageDescription]
    );

    return (
        <React.Fragment>
            <div className="hero">
                <LanguageSelector LeadIn={LeadIn} otherLocales={otherLocales} />
                <RawHTML html={pageDescription} />
            </div>
            <StripsAndFilter {...{category, setCategory}} />
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
