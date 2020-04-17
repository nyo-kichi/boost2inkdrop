import { promises as fs } from 'fs';
import * as path from 'path';
import * as boost from '../boostnote';
import * as ink from '../inkdrop';
import * as models from '../models';
import * as img from './image';
import * as replace from './replacer';

export class Migrator {
    private readonly db: ink.DB;
    private readonly loader: boost.Loader;

    // for rollback, but not implement
    private files: Map<string, models.File> = new Map();
    private notes: Map<string, models.Note> = new Map();
    private tags: Map<string, models.Tag> = new Map();

    public constructor(opts: { db: ink.DB, loader: boost.Loader }) {
        const { db, loader } = opts;
        this.db = db;
        this.loader = loader;
    }

    public async migrate(bookName: string): Promise<void> {
        const book = await models.Book.create(this.db, { name: bookName });

        while (true) {
            const item = await this.loader.next();
            if (item == null) break;

            const { cson, filename } = item;

            console.info(`migrate: ${filename}`);

            if (cson.type !== 'MARKDOWN_NOTE') {
                console.warn('skip a note because cson type is not MARKDOWN_NOTE:', filename);
                continue;
            }
            if (cson.title === '' && cson.content === '') {
                console.warn('skip a note because title and content is empty:', filename);
                continue;
            }

            try {
                await this._migrate({ book, item });
            } catch (e) {
                console.error(`failed to migrate ${filename}: ${e.message}`);
            }
        }
    }

    private async _migrate(opts: { book: models.Book; item: boost.Note }): Promise<void> {
        const { book, item } = opts;
        const { cson } = item;

        const createdAt = Date.parse(cson.createdAt);
        const updatedAt = Date.parse(cson.updatedAt);

        const [body] = await this.convert(cson.content);
        const tags = await Promise.all(cson.tags.map(name => this.tag(name)));

        const { title } = cson;
        await this.note({ body, book, tags, title, createdAt, updatedAt });
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

            body = replace.image(body, image, file);
            files.push(file);
        }

        body = replace.header(body);

        return [body, files];
    }

    private async file(image: img.Image): Promise<models.File | null> {
        const data = await this.imageData(image);
        if (data == null) return null;

        const file = await models.File.create(this.db, {
            contentLength: data.length,
            contentType: mime(image),
            name: image.filename,
            data,
        });

        if (file.isNew) this.files.set(file._id, file);

        return file;
    }

    private async imageData(image: img.Image): Promise<Buffer | null> {
        const path = this.imagePath(image);

        let buf!: Buffer;
        try {
            buf = await fs.readFile(path);
        } catch (e) {
            return null
        }
        return buf;
    }

    private imagePath({ filename, url }: img.Image): string {
        const { storage } = this.loader.dir;

        if (/^\/:storage\/[^\/]+$/.test(url)) {
            return `${storage}/images/${filename}`;
        }
        return url.replace(':storage', `${storage}/attachments`);
    }

    private async note(props: Parameters<typeof models.Note.create>[1]): Promise<models.Note> {
        const note = await models.Note.create(this.db, props);
        if (note.isNew) this.notes.set(note._id, note);
        return note;
    }

    private async tag(name: string): Promise<models.Tag> {
        const tag = await models.Tag.create(this.db, { name });
        if (tag.isNew) this.tags.set(tag._id, tag);
        return tag;
    }
}

function mime({ filename }: Pick<img.Image, 'filename'>): ink.ImageFileType {
    const ext = path.extname(filename).slice(1);
    return `image/${ext}` as ink.ImageFileType;
}
