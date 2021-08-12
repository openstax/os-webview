import React from 'react';
import useCollectionContext from '../collection-context';
import routerBus from '~/helpers/router-bus';
import useAdoptions from '~/pages/my-openstax/store/use-adoptions';
import {RawHTML, useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {EditBookForm} from '../add-book-form/add-book-form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faBookOpen} from '@fortawesome/free-solid-svg-icons/faBookOpen';
import {faLaptop} from '@fortawesome/free-solid-svg-icons/faLaptop';
import useDialog from '~/pages/my-openstax/dialog/dialog';
import $ from '~/helpers/$';
import ClippedImage from '~/components/clipped-image/clipped-image';
import analytics from '~/helpers/analytics';
import './book-details.scss';

const CATEGORY = 'My OpenStax - My Collection';

function sendEvent(action, label) {
    analytics.sendPageEvent(CATEGORY, action, label);
}

function trackLinkClicks(event) {
    const link = event.currentTarget;

    sendEvent('open', link.href);
}


function useAdoptionStatus(book) {
    const {adoptions} = useAdoptions();
    const thisAdoption = adoptions[book.value];

    if (!thisAdoption) {
        return null;
    }
    const statusValue = thisAdoption[0].stageName;

    return statusValue.toLowerCase().includes('interest') ?
        'I am interested in this book' :
        'I have adopted this book';
}

function selectResources(resources) {
    const result = [];
    const cartridges = resources
        .filter((r) => r.endsWith('Course Cartridge'))
        .map((r) => r.replace(' Course Cartridge', ''));
    const others = resources
        .filter((r) => !r.endsWith('Course Cartridge'));

    if (cartridges.length) {
        result.push(`LMS Integration with ${cartridges.join(', ')}`);
    }

    return [...result, ...others].slice(0, 6);
}

function InstructorResources({detailData}) {
    if (!detailData.bookFacultyResources) {
        return null;
    }
    const resources = detailData.bookFacultyResources.map((r) => r.resourceHeading);
    const displayResources = selectResources(resources);

    return (
        <div className="resource-panel">
            <div className="left-side">
                <img src="/images/my-openstax/toolbox.svg" alt="" />
                <div>
                    <div><b>OpenStax {detailData.title} Resources</b></div>
                    <div><i>Always free, included</i></div>
                </div>
                <a
                    href={`/details/${detailData.meta.slug}?Instructor%20resources`}
                    className="btn primary"
                    onClick={trackLinkClicks}
                >
                    Get resources
                </a>
            </div>
            <ul>
                {displayResources.map((r) => <li key={r}>{r}</li>)}
            </ul>
        </div>
    );
}

function TutorResources({detailData}) {
    if (!detailData.tutorMarketingBook) {
        return null;
    }

    return (
        <div className="resource-panel">
            <div className="left-side">
                <img
                    className="tutor-logo"
                    src="/images/openstax-tutor/tutor-logo.svg" alt=""
                />
                <div>
                    <div><b>OpenStax Tutor Courseware</b></div>
                    <div><i>$10/student</i></div>
                </div>
                <a
                    href="/openstax-tutor"
                    className="btn primary"
                    onClick={trackLinkClicks}
                >
                    Learn more
                </a>
            </div>
            <ul>
                <li>
                    <b>Personalized homework</b><br />
                    Build from our library, add your own questions, or edit ours
                </li>
                <li>
                    <b>Digital reading</b><br />
                    Keep students on track with videos, simulations, and conceptual
                    questions interjecting their book reading
                </li>
                <li>
                    <b>Analytics about student success</b><br />
                    View at the assignment or section level
                </li>
                <li><b>LMS Integration</b></li>
            </ul>
        </div>
    );
}

function OnlineResources({detailData}) {
    return (
        <div className="resources">
            <h3 className="top-bar subdivision">
                OpenStax resources and technology available for this book
            </h3>
            <div className="subdivision">
                <InstructorResources detailData={detailData} />
                <TutorResources detailData={detailData} />
            </div>
        </div>
    );
}

export default function BookDetails({book}) {
    const [Dialog, open, close] = useDialog();
    const {setSelectedBook} = useCollectionContext();
    const detailData = $.camelCaseKeys(useDataFromSlug(book.slug)) || {};
    const adoptionStatus = useAdoptionStatus(book);
    const summaryText = detailData.description;

    function goBack(e) {
        e.preventDefault();
        setSelectedBook(null);
    }

    function editBook(e) {
        e.preventDefault();
        open();
    }

    function goToPartners(e) {
        trackLinkClicks(e);
        e.preventDefault();
        routerBus.emit('navigate', '/partners', {
            book: book.value,
            redirect: true
        }, true);
    }

    return (
        <div className="book-details card">
            <div className="subdivision top-bar">
                <a className="back icon-and-text" href="back" onClick={goBack}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span>Back to My Collection</span>
                </a>
                <span className="icon-and-text">
                    <FontAwesomeIcon icon={faBookOpen} />
                    {adoptionStatus}
                </span>
                <a href="edit" onClick={editBook}>Edit status</a>
                <Dialog title="Edit book status">
                    <EditBookForm book={book} afterSubmit={close} />
                </Dialog>
            </div>
            <div className="subdivision bottom-section">
                <div className="summary">
                    <h2>{book.title}</h2>
                    <img className="cover" src={book.coverUrl} />
                    <a
                        className="btn primary" href={book.viewLink}
                        onClick={trackLinkClicks}
                    >
                        <span className="icon-and-text">
                            View online book
                            <FontAwesomeIcon icon={faLaptop} />
                        </span>
                    </a>
                    <a href={`/details/${book.slug}`} onClick={trackLinkClicks}>
                        View more book details
                    </a>
                    <div className="text-block">
                        <h3>Summary</h3>
                        <RawHTML className="summary-text" html={summaryText} />
                    </div>
                </div>
                <div className="after-summary">
                    <OnlineResources detailData={detailData} />
                    <div className="partners">
                        <div className="text-block">
                            <h3>Technology Partners</h3>
                            <div>
                                We partner with dozens of external technology partners to
                                help you find the best solution for your course.
                            </div>
                            <a href="/partners" className="btn" onClick={goToPartners}>Explore options</a>
                        </div>
                        <ClippedImage src="/images/my-openstax/partners-bg.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}
