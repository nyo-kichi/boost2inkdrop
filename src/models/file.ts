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
        const file = new File({ _id, ...props });

        file.store(db);

        return file;
    }

    private async store(db: ink.DB): Promise<void> {
        const { contentType, data, ...rest } = this;

        const { ok } = await db.files.put({
            ...rest,
            contentType,

            _attachments: {
                index: {
                    content_type: contentType,
                    data,
                }
            },
            publicIn: [],
        });

        if (ok ===false) throw new Error(`failed to put file: ${this._id} ${this.name}`);
    }
}

interface Props {
    readonly contentLength: number;
    readonly contentType: ink.ImageFileType;
    readonly name: string;

    readonly data: Buffer;
}

type FileProps = BaseProps & Props;
