#!/usr/bin/env npx ts-node
import Migrator from './src/migrator';

async function main() {
    const mig = await Migrator.create('my-storage');
    await mig.test();
}
main();
