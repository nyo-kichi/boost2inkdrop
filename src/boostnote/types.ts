export interface Note {
    readonly cson: Cson;
    readonly filename: string;
}

export interface Cson {
    createdAt: string;
    updatedAt: string;
    content: string;
    folder: string;
    title: string;
    type: string;
    tags: string[];
    isStarred: boolean;
    isTrashed: boolean;
    linesHighlighted: [];
}
