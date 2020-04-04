#!/usr/bin/env npx ts-node
import * as path from 'path';
import migrate from './src/migrator';

const BOOST_DIR = path.join(process.env.HOME ?? '', 'files/Dropbox/Boostnote/');
const ROOT_DIR = path.resolve(__dirname);
const OUT_DIR = path.join(ROOT_DIR, 'out');

async function main() {
    await migrate({
        boostDir: BOOST_DIR,
        outDir: OUT_DIR,
        storage: 'my-storage',
    });
}
main();
