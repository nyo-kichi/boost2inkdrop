import { promises as fs } from 'fs';
import * as path from 'path';
import * as boost from '../boostnote';
import * as ink from '../inkdrop';
import * as models from '../models';
import * as img from './image';

export class Migrator {
    private readonly db: ink.DB;
    private readonly loader: boost.Loader;

    public constructor(opts: { db: ink.DB, loader: boost.Loader }) {
        const { db, loader } = opts;
        this.db = db;
        this.loader = loader;
    }

    public async migrate(bookName: string): Promise<void> {
        const book = await models.Book.create(this.db, { name: bookName });
        await this._migrate(book);
    }

    private async _migrate(book: models.Book): Promise<void> {
        while (true) {
            const item = await this.loader.next();
            if (item == null) break;

            const { cson, filename } = item;
            if (cson.title === '' && cson.content === '') {
                console.info('skip a note because title and content is empty:', filename);
                continue;
            }

            const createdAt = Date.parse(cson.createdAt);
            const updatedAt = Date.parse(cson.updatedAt);

            const [body] = await this.convert(cson.content);
            const tags = await this.tags(cson);

            const { title } = cson;
            await models.Note.create(this.db, { body, book, tags, title, createdAt, updatedAt });
        }
    }

    private async convert(content: string): Promise<[string, models.File[]]> {
        let body = content;
        const images = img.extract(content);

        const files: models.File[] = [];
        for (const image of images) {
            const file = await this.file(image);

            if (file == null) {
                console.warn(`file not found: ${this.imagePath(image)}`);
                continue;
            }

            body = replace(body, image, file);
            files.push(file);
        }

        return [body, files];
    }

    private async file(image: img.Image): Promise<models.File | null> {
        const path = this.imagePath(image);

        let data!: Buffer;
        try {
            data = await fs.readFile(path);
        } catch (e) {
            return null
        }

        return await models.File.create(this.db, {
            contentLength: data.length,
            contentType: mime(image),
            name: image.filename,
            data,
        });
    }

    private imagePath({ filename, url }: img.Image): string {
        const { storage } = this.loader.dir;

        if (/^\/:storage\/[^\/]+$/.test(url)) {
            return `${storage}/images/${filename}`;
        }
        return url.replace(':storage', `${storage}/attachments`);
    }

    private async tags({ tags }: boost.Cson): Promise<models.Tag[]> {
        return Promise.all(tags.map(name => models.Tag.create(this.db, { name })));
    }
}

function mime({ filename }: Pick<img.Image, 'filename'>): ink.ImageFileType {
    const ext = path.extname(filename).slice(1);
    return `image/${ext}` as ink.ImageFileType;
}

function replace(content: string, image: img.Image, file: models.File): string {
    const { match } = image;
    const { _id, name } = file;

    // `id` is "file:XXX..."
    const link = `![${name}](inkdrop://${_id})`;

    const regexp = new RegExp(escapeRegExp(match), 'g');
    return content.replace(regexp, link);
}

function escapeRegExp(str: string): string {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

export const internal = {
    replace,
};
