import * as path from 'path';
import { promises as fs, Dirent } from 'fs';
import CSON from 'cson-parser';

import * as types from './types';

export default class Loader {
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

    public async next(): Promise<types.LoadedItem | null> {
        const dirent = this.nextEntry();
        if (dirent == null) return null;

        const filename = dirent.name;
        const note = await this.parse(filename);

        return { note, filename };
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

    private async parse(filename: string): Promise<types.Note> {
        const path = this.notePath(filename);
        const cson = await fs.readFile(path, 'utf-8');
        return CSON.parse(cson);
    }
}

interface Options {
    boostDir: string;
    storage: string;
}
