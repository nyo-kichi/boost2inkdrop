import * as models from './models';

export interface LocalDB {
    readonly books: DBBook;
    readonly files: DBFile;
    readonly notes: DBNote;
    readonly tags: DBTag;
    readonly utils: any;
}

export type DB = LocalDB;

interface Base {
    createId(): string;
    validateDocId(docId: string): boolean;
    get(docId: string, opts?: any): Promise<any>;
    remove(docId: string): Promise<Result>;
    removeBatch(docIds: string[]): Promise<Result[]>;
    countAll(): Promise<number>;
    all(opts?: any): Promise<any>;
}

interface DBFile extends Base {
    put(doc: models.File): Promise<Result>;
}

interface DBNote extends Base {
    put(doc: models.Note): Promise<Result>;
}

interface DBBook extends Base {
    put(doc: models.Book): Promise<Result>;
    findWithName(name: string): Promise<any>;
}

interface DBTag extends Base {
    put(doc: models.Tag): Promise<Result>;
    findWithName(name: string): Promise<any>;
}

export interface Result {
    readonly ok: boolean;
    readonly id: string;
    readonly rev: string;
}
