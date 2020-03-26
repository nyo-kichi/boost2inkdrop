import * as path from 'path';
import { promises as fs, Dirent } from 'fs';
import CSON from 'cson-parser';
import mkdirp from 'mkdirp';

import * as bn from './boostnote';

const BOOST_DIR = path.join(process.env.HOME ?? '', 'files/Dropbox/Boostnote/');
const ROOT_DIR = path.resolve('..', __dirname);

export default class Migrator {
    private readonly outDir: string;
    private readonly storageDir: string;
    private entries: Dirent[] = [];
    private current = 0;

    public constructor(opts: Options) {
        const { outDir, storage } = opts;
        this.outDir = outDir;
        this.storageDir = path.join(BOOST_DIR, storage);
    }

    private get noteDir(): string {
        return path.join(this.storageDir, 'notes');
    }

    private notePath(filename: string): string {
        return path.join(this.noteDir, filename);
    }

    private async load(): Promise<void> {
        this.entries = await fs.readdir(this.noteDir, { withFileTypes: true });
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

    public static async create(storage: string): Promise<Migrator> {
        const outDir = path.join(ROOT_DIR, 'out');

        const made = await mkdirp(outDir);
        if (made) console.warn(`made directories: ${outDir}`);

        return new Migrator({ outDir, storage });
    }

    public async test(): Promise<void> {
        await this.load();

        const dirent = this.nextEntry();
        if (dirent == null) return;

        // const filename = dirent.name;
        const filename = 'fa0e2f95-7744-48f4-8ea0-120fffbf708e.cson';

        const note = await this.parse(filename);

        console.log(note);
    }
}

interface Options {
    storage: string;
    outDir: string;
}
