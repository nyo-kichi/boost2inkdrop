import assert = require('assert'); // eslint-disable-line @typescript-eslint/no-require-imports
import { extract } from 'src/migrator/image';

describe('extract()', () => {
    it('should extract images', () => {
        const images = extract(content());

        assert.deepStrictEqual(images, [
            {
                filename: '1871e8b6.png',
                match: '![1871e8b6.png](:storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png)',
                text: '1871e8b6.png',
                url: ':storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png',
            },
            {
                filename: '0.l5b3ymp99sa.png',
                match: '![0.l5b3ymp99sa](/:storage/0.l5b3ymp99sa.png)',
                text: '0.l5b3ymp99sa',
                url: '/:storage/0.l5b3ymp99sa.png',
            },
            {
                filename: '1871e8b6.png',
                match: '![1871e8b6.png](:storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png)',
                text: '1871e8b6.png',
                url: ':storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png',
            },
        ]);
    });
});

function content(): string {
    return `# title

https://my.inkdrop.app/

## h2-1

![1871e8b6.png](:storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png)

## h2-2

![0.l5b3ymp99sa](/:storage/0.l5b3ymp99sa.png)![1871e8b6.png](:storage/fa0e2f95-7744-48f4-8ea0-120fffbf708e/1871e8b6.png)

`;
}
