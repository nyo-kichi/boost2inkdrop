import * as path from 'path';
import { promises as fs, Dirent } from 'fs';
import CSON from 'cson-parser';
import mkdirp from 'mkdirp';

import * as bn from './types/boostnote';
import extractImages from './image-extractor';

export default class Migrator {
    private readonly dir: {
        boost: string;
        note: string;
        out: string;
        storage: string;
    };
    private readonly storage: string;

    private entries: Dirent[] = [];
    private current = 0;

    public constructor(opts: Options) {
        const { boostDir, outDir, storage } = opts;

        const storageDir = path.join(boostDir, storage);
        const noteDir = path.join(storageDir, 'notes');
        this.dir = {
            boost: boostDir,
            note: noteDir,
            out: outDir,
            storage: storageDir,
        };
        this.storage = storage;
    }

    private async init(): Promise<void> {
        const made = await mkdirp(this.dir.out);
        if (made) console.warn(`made directories: ${this.dir.out}`);
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

    private async parse(filename: string): Promise<bn.Note> {
        const path = this.notePath(filename);
        const cson = await fs.readFile(path, 'utf-8');
        return CSON.parse(cson);
    }

    public static async create(opts: Options): Promise<Migrator> {
        const mig = new Migrator(opts);
        await mig.init();
        return mig;
    }

    public async migrate(): Promise<void> {
        await this.load();

        while (true) {
            const dirent = this.nextEntry();
            if (dirent == null) break;

            const filename = dirent.name;

            const note = await this.parse(filename);
            const images = extractImages(note);
console.log('--', filename, '--');
console.log(images);
console.log(note);
        }
    }

    public async test(): Promise<void> {
        await this.load();

        const dirent = this.nextEntry();
        if (dirent == null) return;

        const filename = dirent.name;
        // const filename = 'fa0e2f95-7744-48f4-8ea0-120fffbf708e.cson';

        const note = await this.parse(filename);
        console.log('--', filename, '--');
        // extractImages(note);
        console.log(note);
    }
}

interface Options {
    boostDir: string;
    outDir: string;
    storage: string;
}
