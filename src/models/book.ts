import { Base, BaseProps } from './base';
import * as ink from '../inkdrop';

export class Book extends Base {
    readonly name: string
    readonly parentBook?: null | Book;

    public constructor(props: BookProps) {
        const { name, parentBook, ...rest } = props;
        super(rest);
        this.name = name;
        this.parentBook = parentBook;
    }

    public static async create(db: ink.DB, props: Props): Promise<Book> {
        const { name } = props;
        const doc: ink.Book = await db.books.findWithName(name);
        if (doc != null) return new Book(doc);

        const _id = db.books.createId();
        const book = new Book({ _id, name, ...props });

        book.store(db);

        return book;
    }

    private async store(db: ink.DB): Promise<void> {
        const { parentBook, ...rest } = this;

        const { ok } = await db.books.put({
            ...rest,
            parentBookId: parentBook?._id,
        });

        if (ok ===false) throw new Error(`failed to put book: ${this.name}`);
    }
}

interface Props {
    readonly name: string
    readonly parentBook?: null | Book;
}

type BookProps = BaseProps & Props;
