import { Loader } from './boostnote'
import { Migrator } from './migrator';

declare const inkdrop: any;

const LIMIT = 2000;

export async function migrate(opts: Options): Promise<void> {
    const { boostDir, storage } = opts;
    const db = inkdrop.main.dataStore.getLocalDB();
    const loader = await Loader.create({ boostDir, storage });
    const bookName = `migration.${Date.now()}`;
    await new Migrator({ db, loader }).migrate(bookName);
}

interface Options {
    boostDir: string;
    storage: string;
}

export async function deleteAllNotesInBook(bookName: string): Promise<void> {
    console.info('deleteAllNotesInBook()');

    const db = inkdrop.main.dataStore.getLocalDB();

    const book = await db.books.findWithName(bookName);
    console.info('book:', book.name, book._id);

    const { docs: notes } = await db.notes.findInBook(book._id, { limit: LIMIT });

    const ids = notes.map((note: any) => note._id);

    let results!: any[];
    try {
        results = await db.notes.removeBatch(ids);
    } catch (e) {
        console.error('failed to removeBatch:', e.message);
    }
    console.info('removeBatch():', results.length);
}
