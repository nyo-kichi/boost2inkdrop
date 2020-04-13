import * as path from 'path';
import { promises as fs, Dirent } from 'fs';
import * as CSON from 'cson-parser';

import * as types from './types';

export class Loader {
    private readonly dir: {
        boost: string;
        note: string;
        storage: string;
    };
    private readonly storage: string;

    private entries: Dirent[] = [];
    private current = 0;

    public constructor(opts: Options) {
        const { boostDir, storage } = opts;

        const storageDir = path.join(boostDir, storage);
        const noteDir = path.join(storageDir, 'notes');
        this.dir = {
            boost: boostDir,
            note: noteDir,
            storage: storageDir,
        };
        this.storage = storage;
    }

    public static async create(opts: Options): Promise<Loader> {
        const loader = new Loader(opts);
        await loader.load();
        return loader;
    }

    public async next(): Promise<types.Note | null> {
        const dirent = this.nextEntry();
        if (dirent == null) return null;

        const filename = dirent.name;
        const cson = await this.parse(filename);

        return { cson, filename };
    }

    private notePath(filename: string): string {
        return path.join(this.dir.note, filename);
    }

    private async load(): Promise<void> {
        this.entries = await fs.readdir(this.dir.note, { withFileTypes: true });
    }

    private nextEntry(): Dirent | null {
        const dirent = this.entries[this.current++];
        if (dirent == null) return null;
        if (dirent.isDirectory()) return this.nextEntry();
        return dirent;
    }

    private async parse(filename: string): Promise<types.Cson> {
        const path = this.notePath(filename);
        const content = await fs.readFile(path, 'utf-8');
        return CSON.parse(content);
    }
}

interface Options {
    boostDir: string;
    storage: string;
}
