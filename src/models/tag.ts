import { Base, BaseProps } from './base';
import * as ink from '../inkdrop';

export class Tag extends Base {
    public readonly name: string;
    public readonly count: number;

    public constructor(props: TagProps) {
        const { name, count, ...rest } = props;
        super(rest);
        this.name = name;
        this.count = count ?? 0;
    }

    public static async create(db: ink.DB, { name }: Props): Promise<Tag> {
        const doc: ink.Tag = await db.tags.findWithName(name);
        if (doc != null) return new Tag({ ...doc, isNew: false });

        const _id = db.tags.createId();
        const tag = new Tag({ _id, name, isNew: true });

        tag.store(db);

        return tag;
    }

    public async store(db: ink.DB): Promise<void> {
        const { isNew, ...rest } = this;
        if (isNew === false) return;

        try {
            await db.tags.put({
                ...rest,
                color: ink.TagColor.DEFAULT,
            });
        } catch (e) {
            throw new Error(`failed to put tag: ${this._id} ${this.name}: ${e.message}`);
        }
    }
}

interface Props {
    readonly name: string;
    readonly count?: number;
}

type TagProps = BaseProps & Props;
