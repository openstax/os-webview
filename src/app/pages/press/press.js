import React, {useState, useEffect, useContext} from 'react';
import PageContext from './page-context';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {RawHTML, createPageContextProvider} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {ArticleLoader} from './article/article';
import MoreFewer, {Paginated} from '~/components/more-fewer/more-fewer';
import Inquiries from './inquiries/inquiries';
import Bookings from './bookings/bookings';
import MobileSelector from './mobile-selector/mobile-selector';
import PressExcerpt from './press-excerpt/press-excerpt';
import './press.css';

const asDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');

    return new Date(year, month - 1, day);
};
const convertedDate = (dateStr) => {
    return asDate(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

function PressReleases({excludeSlug, Container=MoreFewer}) {
    const pageData = useContext(PageContext);

    if (!pageData) {
        return null;
    }

    const pressReleases = Object.entries(pageData.releases)
        .filter(([slug]) => slug !== excludeSlug)
        .map(([slug, release]) => ({
            author: release.author,
            date: convertedDate(release.date),
            asDate: asDate(release.date),
            url: `/${slug}`,
            headline: release.heading,
            excerpt: release.excerpt
        }))
        .sort((a, b) => b.asDate.getTime() - a.asDate.getTime());

    return (
        <Container pluralItemName="press releases">
            {pressReleases.map((props) => <PressExcerpt {...props} key={props} />)}
        </Container>
    );
}

function NewsMentions() {
    const pageData = useContext(PageContext);

    if (!pageData) {
        return null;
    }

    const newsMentions = pageData.mentions
        .map((obj) => ({
            iconUrl: obj.source.logo,
            source: obj.source.name,
            date: convertedDate(obj.date),
            asDate: asDate(obj.date),
            headline: obj.headline,
            url: obj.url
        }))
        .sort((a, b) => b.asDate.getTime() - a.asDate.getTime());

    return (
        <Paginated>
            {newsMentions.map((props) => <PressExcerpt {...props} key={props} />)}
        </Paginated>
    );
}

function MissionStatements() {
    const pageData = useContext(PageContext);

    if (!pageData) {
        return null;
    }

    const missionStatements = pageData.mission_statements
        .map((obj) => obj.statement);

    return (
        <React.Fragment>
            {missionStatements.map((html) => <RawHTML html={html} key={html} />)}
        </React.Fragment>
    );
}

function ArticlePage({slug}) {
    return (
        <React.Fragment>
            <ArticleLoader slug={slug} />
            <div className="text-content">
                <h1>Other press releases</h1>
                <div className="other press-releases">
                    <PressReleases excludeSlug={slug} />
                </div>
            </div>
        </React.Fragment>
    );
}

function SelectableSection({selected, className, children}) {
    const classList = [className, 'hidden-on-mobile'];

    if (selected) {
        classList.push('active');
    }

    return (
        <div className={classList.join(' ')}>
            {children}
        </div>
    );
}

function MainPage() {
    const pageData = useContext(PageContext);
    const sections = [
        'Press releases',
        'News mentions',
        'Press inquiries',
        'Booking'
    ];
    const [selectedSection, setSelectedSection] = useState(sections[0]);

    if (!pageData) {
        return null;
    }

    const headline = pageData.title;

    return (
        <React.Fragment>
            <div className="hero">
                <h1>{headline}</h1>
                <MobileSelector
                    values={sections}
                    selectedValue={selectedSection}
                    onChange={setSelectedSection}
                />
            </div>
            <div className="main-body">
                <div className="main-content">
                    <SelectableSection
                        className="press-releases"
                        selected={selectedSection === sections[0]}
                    >
                        <h2>Press releases</h2>
                        <div className="mobile-only">
                            <PressReleases Container={Paginated} />
                        </div>
                        <div className="hidden-on-mobile">
                            <PressReleases />
                        </div>
                    </SelectableSection>
                    <SelectableSection
                        className="news-mentions"
                        selected={selectedSection === sections[1]}
                    >
                        <h2>News mentions</h2>
                        <NewsMentions />
                    </SelectableSection>
                </div>
                <div className="sidebar">
                    <div className="our-mission hidden-on-mobile">
                        <h2>Our mission</h2>
                        <MissionStatements />
                    </div>
                    <SelectableSection
                        className="press-inquiries"
                        selected={selectedSection === sections[2]}
                    >
                        <Inquiries />
                    </SelectableSection>
                    <SelectableSection
                        className="book-experts"
                        selected={selectedSection === sections[3]}
                    >
                        <Bookings />
                    </SelectableSection>
                </div>
            </div>
        </React.Fragment>
    );
}

function articleSlugFromPath() {
    const slugMatch = window.location.pathname.match(/\/(press\/.+)/);

    return slugMatch ? slugMatch[1] : null;
}

function useArticleSlugFromPath() {
    const [slug, setSlug] = useState(articleSlugFromPath());

    useEffect(() => {
        function setIt() {
            setSlug(articleSlugFromPath());
        }

        window.addEventListener('popstate', setIt);
        return () => window.removeEventListener('popstate', setIt);
    });

    return slug;
}

export function PressWrapper() {
    const articleSlug = useArticleSlugFromPath();
    const PageContextProvider = createPageContextProvider({
        Context: PageContext,
        slug: 'press'
    });

    return (
        <PageContextProvider>
            {
                articleSlug ?
                    <ArticlePage slug={articleSlug} /> :
                    <MainPage />
            }
        </PageContextProvider>
    );
}

const view = {classes: ['press', 'page']};

export default pageWrapper(PressWrapper, view);
