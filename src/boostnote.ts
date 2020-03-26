export interface Note {
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
