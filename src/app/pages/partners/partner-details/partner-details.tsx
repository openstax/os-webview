import React from 'react';
import usePartnerContext, {
    PartnerContextProvider,
    Model
} from './partner-context';
import Synopsis from './synopsis/synopsis';
import Carousel from './carousel/carousel';
import RawHTML from '~/components/jsx-helpers/raw-html';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import booksPromise from '~/models/books';
import type {Book} from '~/helpers/books';
import InfoRequestForm from './info-request-form/info-request-form';
import './partner-details.scss';

function getTitlesFromAbbreviations(abbreviations: string[], bookInfo: Book[]) {
    return abbreviations
        .map(
            (abbrev) =>
                bookInfo.find((b) => b.salesforce_abbreviation === abbrev) ||
                abbrev
        )
        .filter((b) => {
            const found = typeof b === 'object';

            if (!found) {
                console.warn('Book not found:', b);
            }
            return found;
        })
        .map((b) => b.salesforce_name);
}

function useRealTitles(books: Model['books']) {
    const [titles, setTitles] = React.useState(books);

    React.useEffect(() => {
        booksPromise.then((results) =>
            setTitles(getTitlesFromAbbreviations(books, results))
        );
    }, [books]);

    return titles;
}

function RequestInfoButton({infoText}: {infoText: string}) {
    const {toggleForm, books} = usePartnerContext();
    const validTitle = books?.find((b) => b.length > 0); // Quirk: no books is an array of one empty string

    if (!validTitle) {
        return null;
    }

    return (
        <section>
            <button
                type="button"
                className="primary"
                onClick={() => toggleForm?.()}
            >
                {infoText}
            </button>
        </section>
    );
}

export function Overview({model, icon}: {model: Model; icon: string}) {
    const {
        richDescription: description,
        infoLinkText: infoText,
        books,
        images,
        videos,
        title: partnerName
    } = model;
    const titles = useRealTitles(books);
    const {toggleForm} = usePartnerContext();

    if (!toggleForm) {
        return null;
    }

    // For TESTING
    // if (images.length < 6) {
    //     images.push(...([1,2,3,4,'last'].map(
    //         (i) => `https://via.placeholder.com/150x150?text=[image ${i}]`
    //     )));
    // }
    // console.info('Images', images);
    // TESTING
    return (
        <React.Fragment>
            <section className="carousel">
                <Carousel {...{icon, images, videos}} />
            </section>
            <RequestInfoButton {...{infoText, partnerName}} />
            <hr />
            <section className="overview">
                <h2>Overview</h2>
                <RawHTML className="main-text" html={description} />
                <h2>Related Books</h2>
                <div className="titles">
                    {titles.map((title) => (
                        <span className="title" key={title}>
                            {title}
                        </span>
                    ))}
                </div>
            </section>
        </React.Fragment>
    );
}

function PartnerDetails({model}: {model: Model}) {
    const {
        website,
        partnerWebsite,
        websiteLinkText: partnerLinkText,
        logoUrl
    } = model;
    const icon =
        logoUrl || 'https://via.placeholder.com/150x150?text=[no%20logo]';
    const partnerLinkProps = {
        partnerUrl: website || partnerWebsite,
        partnerLinkText
    };
    // ** Restore the Reviews tab when using Reviews again
    // const labels = ['Overview', 'Reviews'];
    const labels = ['Overview'];
    const [selectedLabel, setSelectedLabel] = React.useState(labels[0]);

    return (
        <div className="partner-details">
            <div className="sticky-region">
                <Synopsis {...{model, icon, partnerLinkProps}} />
                <TabGroup {...{labels, selectedLabel, setSelectedLabel}} />
            </div>
            <div className="scrolling-region boxed">
                <div className="tab-content">
                    <ContentGroup
                        activeIndex={labels.indexOf(selectedLabel)}
                        labels={labels}
                    >
                        <Overview model={model} icon={icon} />
                        {
                            // ** Restore when using Reviews again
                            // <Reviews partnerId={model.id} />
                        }
                    </ContentGroup>
                </div>
            </div>
        </div>
    );
}

function PartnerDetailsOrInfoRequestForm({model}: {model: Model}) {
    const {showInfoRequestForm} = usePartnerContext();

    return showInfoRequestForm ? (
        <InfoRequestForm />
    ) : (
        <PartnerDetails model={model} />
    );
}

type ContextProps = Exclude<
    Parameters<typeof PartnerContextProvider>[0]['contextValueParameters'],
    undefined
>;
type Props = {
    detailData: {id: ContextProps['id']} & Model;
} & Pick<ContextProps, 'title' | 'setTitle'>;

export default function PartnerDetailsWrapper({
    detailData: {id, ...model},
    title,
    setTitle
}: Props) {
    return (
        <PartnerContextProvider
            contextValueParameters={{id, model, title, setTitle}}
        >
            <PartnerDetailsOrInfoRequestForm model={model} />
        </PartnerContextProvider>
    );
}
