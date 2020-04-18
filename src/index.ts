import { Loader } from './boostnote'
import { Migrator } from './migrator';

declare const inkdrop: any;

export async function migrate({ boostDir, storage }: Options): Promise<void> {
    const db = inkdrop.main.dataStore.getLocalDB();
    const loader = await Loader.create({ boostDir, storage });

    const bookName = `migration.${Date.now()}`;
    await new Migrator({ db, loader }).migrate(bookName);
}

interface Options {
    boostDir: string;
    storage: string;
}
