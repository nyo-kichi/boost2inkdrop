import { Base, BaseProps } from './base';
import { Book } from './book';
import { Tag } from './tag';
import * as ink from '../inkdrop';

export class Note extends Base {
    public readonly body: string;
    public readonly book: Book;
    public readonly tags: Tag[];
    public readonly title: string;

    public constructor(props: NoteProps) {
        const { body, book, tags, title, ...rest } = props;
        super(rest);
        this.body = body;
        this.book = book;
        this.tags = tags;
        this.title = title;
    }

    public static async create(db: ink.DB, props: Props): Promise<Note> {
        const _id = db.notes.createId();
        const note = new Note({ _id, ...props, isNew: true });

        note.store(db);

        return note;
    }

    public async store(db: ink.DB): Promise<void> {
        const { isNew, book, tags, ...rest } = this;
        if (isNew === false) return;

        const tagIds = tags.map(t => t._id);

        try {
            await db.notes.put({
                ...rest,
                bookId: book._id,
                doctype: 'markdown',
                pinned: false,
                share: ink.NoteVisibility.PRIVATE,
                status: ink.NoteStatus.NONE,
                tags: tagIds,
            });
        } catch (e) {
            throw new Error(`failed to put note: ${this._id} ${this.title}: ${e.message}`);
        }
    }
}

interface Props {
    readonly body: string;
    readonly book: Book;
    readonly tags: Tag[];
    readonly title: string;

    readonly createdAt?: number;
    readonly updatedAt?: number;
}

type NoteProps = BaseProps & Props;
