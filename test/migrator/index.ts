import assert = require('assert'); // eslint-disable-line @typescript-eslint/no-require-imports
import { internal } from 'src/migrator/index';
import { File } from 'src/models';
import { extract } from 'src/migrator/image';

describe('replace()', () => {
    const { replace } = internal;

    it('should replace correctly', () => {
        const c = content();
        const [image] = extract(c);

        const props: any = { _id: 'file:ID', name: 'filename' };
        const file = new File(props);

        const got = replace(c, image, file);
        const exp = `# title

https://my.inkdrop.app/

## h2-1

![filename](inkdrop://file:ID)

## h2-2

![0.l5b3ymp99sa](/:storage/0.l5b3ymp99sa.png)![filename](inkdrop://file:ID)

`;
        assert(got === exp);
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
