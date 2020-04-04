import assert = require('assert'); // eslint-disable-line @typescript-eslint/no-require-imports
import extract from 'src/image-extractor';

describe('extract()', () => {
    it('test', () => {
        const content = '# title\n' +
            '\n' +
            'https://my.inkdrop.app/\n' +
            '\n' +
            '## h2-1\n' +
            '\n' +
            '![1871e8b6.png](:storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png)\n' +
            '\n' +
            '## h2-2\n' +
            '\n' +
            '![0.l5b3ymp99sa](/:storage/0.l5b3ymp99sa.png)' +
            '![1871e8b6.png](:storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png)\n' +
            '\n';

        const images = extract(content);

        assert.deepStrictEqual(images, [
            {
                filename: '1871e8b6.png',
                path: ':storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png',
                text: '1871e8b6.png',
            },
            {
                filename: '0.l5b3ymp99sa.png',
                path: '/:storage/0.l5b3ymp99sa.png',
                text: '0.l5b3ymp99sa',
            },
            {
                filename: '1871e8b6.png',
                path: ':storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png',
                text: '1871e8b6.png',
            },
        ]);
    });
});
