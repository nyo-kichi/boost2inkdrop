import * as bn from './boostnote'
import extractImages from './image-extractor';

export default async function migrate(opts: Options): Promise<void> {
    const { boostDir, storage } = opts;

    const loader = await bn.Loader.create({ boostDir, storage });

    while (true) {
        const item = await loader.next();
        if (item == null) break;

        const { note, filename } = item;
        if (filename !== 'fa0e2f95-7744-48f4-8ea0-120fffbf708e.cson') continue;

        const images = extractImages(note.content);
console.log('--', filename, '--');
console.log(images);
console.log(note);
    }
}

interface Options {
    boostDir: string;
    outDir: string;
    storage: string;
}
