import { Base, BaseProps } from './base';
import * as ink from '../inkdrop';

export class Tag extends Base {
    public readonly name: string;

    public constructor(props: TagProps) {
        const { name, ...rest } = props;
        super(rest);
        this.name = name;
    }

    public static async create(db: ink.DB, { name }: Props): Promise<Tag> {
        const doc: ink.Tag = await db.tags.findWithName(name);
        if (doc != null) return new Tag(doc);

        const _id = db.tags.createId();
        const tag = new Tag({ _id, name });

        // tag.store(db);

        return tag;
    }

    private async store(db: ink.DB): Promise<void> {
        const { ok } = await db.tags.put({
            ...this,
            color: ink.TagColor.DEFAULT,
        });

        if (ok ===false) throw new Error(`failed to put tag: ${this._id} ${this.name}`);
    }
}

interface Props {
    readonly name: string;
}

type TagProps = BaseProps & Props;
