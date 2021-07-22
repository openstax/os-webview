import React from 'react';
import { AddButton } from '../common';
import useAdoptions from '~/pages/my-openstax/store/use-adoptions';
import useDialog from '~/pages/my-openstax/dialog/dialog';
import BookDetails from './book-details/book-details';
import BookList from './book-list/book-list';
import AddBookForm from './add-book-form/add-book-form';
import useCollectionContext, {CollectionContextProvider} from './collection-context';
import './collection.scss';

function Collection({id, hidden}) {
    const [Dialog, open, close] = useDialog();
    const {adoptions} = useAdoptions();
    const actualAdoptions = Reflect.ownKeys(adoptions)
        .filter((b) => !adoptions[b][0].stageName.includes('Interest'))
        .reduce((a, b) => {a[b]=adoptions[b]; return a;}, {});
    const interests = Reflect.ownKeys(adoptions)
        .filter((b) => adoptions[b][0].stageName.includes('Interest'))
        .reduce((a, b) => {a[b]=adoptions[b]; return a;}, {});

    return (
        <section id={id} hidden={hidden}>
            <h2>My Collection</h2>
            <AddButton label="Add a book" onClick={open} />
            <Dialog title="Add new book">
                <AddBookForm afterSubmit={close} />
            </Dialog>
            <div className="card">
                <BookList header="My adopted books" adoptions={actualAdoptions} />
                <BookList header="Books I’m interested in" adoptions={interests} />
            </div>
        </section>
    );
}

function CollectionOrBookDetails({id, hidden}) {
    const {selectedBook} = useCollectionContext();

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
