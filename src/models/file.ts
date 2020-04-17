import { Base, BaseProps } from './base';
import * as ink from '../inkdrop';

export class File extends Base {
    public readonly contentLength: number;
    public readonly contentType: ink.ImageFileType;
    public readonly name: string;

    private readonly data: Buffer;

    public constructor(props: FileProps) {
        const { contentLength, contentType, name, data, ...rest } = props;
        super(rest);
        this.contentLength = contentLength;
        this.contentType = contentType;
        this.name = name;
        this.data = data;
    }

    public static async create(db: ink.DB, props: Props): Promise<File> {
        const _id = db.files.createId();
        const file = new File({ _id, ...props, isNew: true });

        file.store(db);

        return file;
    }

    public async store(db: ink.DB): Promise<void> {
        const { isNew, contentType, data, ...rest } = this;
        if (isNew === false) return;

        try {
            await db.files.put({
                ...rest,
                contentType,

                _attachments: {
                    index: { content_type: contentType, data },
                },
                publicIn: [],
            });
        } catch (e) {
            throw new Error(`failed to put file: ${this._id} ${this.name}: ${e.message}`);
        }
    }
}

interface Props {
    readonly contentLength: number;
    readonly contentType: ink.ImageFileType;
    readonly name: string;

    readonly data: Buffer;
}

type FileProps = BaseProps & Props;
