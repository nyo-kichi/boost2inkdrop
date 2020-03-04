#!/usr/bin/env npx ts-node
import * as path from 'path';
import { promises as fs, Dirent } from 'fs';
import CSON from 'cson-parser';

const BOOST_DIR = path.join(process.env.HOME ?? '', 'files/Dropbox/Boostnote/');

class Migrator {
    private readonly storageDir: string;
    private entries: Dirent[] = [];
    private current = 0;

    public constructor(storage: string) {
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

    private async parse(filename: string): Promise<object> {
        const path = this.notePath(filename);
        const cson = await fs.readFile(path, 'utf-8');
        return CSON.parse(cson);
    }

    public async test(): Promise<void> {
        await this.load();

        const dirent = this.nextEntry();
        if (dirent == null) return;

        const filename = dirent.name;
console.log(filename);
        const obj = await this.parse(filename);

        console.log(obj);
    }
}

async function main() {
    const mig = new Migrator('my-storage');
    await mig.test();
}
main();
