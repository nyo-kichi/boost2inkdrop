const NOW = Date.now();

export class Base {
    public readonly _id: string;
    public readonly createdAt: number;
    public readonly updatedAt: number;

    protected constructor(props: BaseProps) {
        this._id = props._id;
        this.createdAt = props.createdAt ?? NOW;
        this.updatedAt = props.updatedAt ?? NOW;
    }
}

export interface BaseProps {
    readonly _id: string;
    readonly createdAt?: number;
    readonly updatedAt?: number;
}
