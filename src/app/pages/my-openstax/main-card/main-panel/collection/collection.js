import React from 'react';
import { AddButton } from '../common';
import useAdoptions from '~/pages/my-openstax/store/use-adoptions';
import useDialog from '~/pages/my-openstax/dialog/dialog';
import BookDetails from './book-details/book-details';
import BookList from './book-list/book-list';
import AddBookForm from './add-book-form/add-book-form';
import CollectionContext, {CollectionContextProvider} from './collection-context';
import './collection.scss';

function Collection({id, hidden}) {
    const [Dialog, open, close] = useDialog();
    const {adoptions} = useAdoptions();

    return (
        <section id={id} hidden={hidden}>
            <h2>My Collection</h2>
            <AddButton label="Add a book" onClick={open} />
            <Dialog title="Add new book">
                <AddBookForm afterSubmit={close} />
            </Dialog>
            <div className="card">
                <BookList header="My adopted books" adoptions={adoptions} />
                <BookList header="Books I’m interested in" />
            </div>
        </section>
    );
}

function CollectionOrBookDetails({id, hidden}) {
    const {selectedBook} = React.useContext(CollectionContext);

    return (
        <React.Fragment>
            {selectedBook && <BookDetails book={selectedBook} />}
            <Collection id={id} hidden={selectedBook || hidden} />
        </React.Fragment>
    );
}

export default function ContextWrapper({id, hidden}) {
    return (
        <CollectionContextProvider>
            <CollectionOrBookDetails id={id} hidden={hidden} />
        </CollectionContextProvider>
    );
}
