import React from 'react';
import CollectionContext from '../collection-context';
import cmsFetch from '~/models/cmsFetch';
import routerBus from '~/helpers/router-bus';
import useAdoptions from '~/pages/my-openstax/store/use-adoptions';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {EditBookForm} from '../add-book-form/add-book-form';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faBookOpen} from '@fortawesome/free-solid-svg-icons/faBookOpen';
import {faLaptop} from '@fortawesome/free-solid-svg-icons/faLaptop';
import useDialog from '~/pages/my-openstax/dialog/dialog';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './book-details.scss';

function useSummaryText(slug) {
    const [text, setText] = React.useState('');

    React.useEffect(() => cmsFetch(slug).then(({description}) => setText(description)), [slug]);

    return text;
}

function useAdoptionStatus(book) {
    const {adoptions} = useAdoptions();
    const thisAdoption = adoptions[book.label];
    const statusValue = thisAdoption[0].stageName;

    console.info('SV', statusValue);
    return statusValue.toLowerCase().includes('interest') ?
        'I am interested in this book' :
        'I have adopted this book';
}

export default function BookDetails({book}) {
    const [Dialog, open, close] = useDialog();
    const {setSelectedBook} = React.useContext(CollectionContext);
    const summaryText = useSummaryText(book.slug);
    const adoptionStatus = useAdoptionStatus(book);

    function goBack(e) {
        e.preventDefault();
        setSelectedBook(null);
    }

    function editBook(e) {
        e.preventDefault();
        open();
    }

    function goToPartners(e) {
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
                    <a className="btn primary" href={book.viewLink}>
                        <span className="icon-and-text">
                            View online book
                            <FontAwesomeIcon icon={faLaptop} />
                        </span>
                    </a>
                    <a href={`/details/${book.slug}`}>View more book details</a>
                    <div className="text-block">
                        <h3>Summary</h3>
                        <RawHTML className="summary-text" html={summaryText} />
                    </div>
                </div>
                <div className="resources">
                    <h3 className="top-bar subdivision">
                        OpenStax resources and technology available for this book
                    </h3>
                    <div className="subdivision">
                    </div>
                </div>
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
    );
}
