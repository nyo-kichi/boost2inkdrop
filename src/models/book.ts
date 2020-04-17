import { Base, BaseProps } from './base';
import * as ink from '../inkdrop';

export class Book extends Base {
    public readonly name: string
    public readonly parentBook?: null | Book;

    public constructor(props: BookProps) {
        const { name, parentBook, ...rest } = props;
        super(rest);
        this.name = name;
        this.parentBook = parentBook;
    }

    public static async create(db: ink.DB, props: Props): Promise<Book> {
        const { name } = props;
        const doc: ink.Book = await db.books.findWithName(name);
        if (doc != null) return new Book({ ...doc, isNew: false });

        const _id = db.books.createId();
        const book = new Book({ _id, name, ...props, isNew: true });

        book.store(db);

        return book;
    }

    public async store(db: ink.DB): Promise<void> {
        const { isNew, parentBook, ...rest } = this;
        if (isNew === false) return;

        try {
            await db.books.put({
                ...rest,
                parentBookId: parentBook?._id,
            });
        } catch (e) {
            throw new Error(`failed to put book: ${this._id} ${this.name}: ${e.message}`);
        }
    }
}

interface Props {
    readonly name: string
    readonly parentBook?: null | Book;
}

type BookProps = BaseProps & Props;
