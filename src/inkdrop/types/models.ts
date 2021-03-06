import * as types from './basic-types';

// cf. flowtype https://github.com/inkdropapp/inkdrop-model

export interface BookMetadata {
    readonly _id: string,
    readonly _rev?: string,
    readonly count?: number,
    readonly createdAt: number,
    readonly parentBookId?: null | string
    readonly updatedAt: number,
}

export interface Book extends BookMetadata {
    readonly name: string
}

export type FileAttachmentItem = {
    readonly content_type: types.ImageFileType;
    readonly data: Buffer | string;
}

export interface File {
    readonly _id: string;
    readonly _rev?: string;
    readonly name: string;
    readonly createdAt: number;
    readonly contentType: types.ImageFileType;
    readonly contentLength: number;
    readonly publicIn: string[];
    readonly _attachments: {
        readonly index: FileAttachmentItem;
    },
    readonly md5digest?: string;
}

export interface NoteMetadata {
    readonly _id: string;
    readonly _rev?: string;
    readonly bookId: string;
    readonly doctype: string;
    readonly createdAt: number;
    readonly numOfCheckedTasks?: number;
    readonly numOfTasks?: number;
    readonly migratedBy?: string;
    readonly pinned: boolean;
    readonly share: types.NoteVisibility;
    readonly status: types.NoteStatus;
    readonly tags?: string[];
    readonly updatedAt: number;
}

export interface Note extends NoteMetadata {
    readonly body: string;
    readonly title: string;
}

export type TagMetadata = {
    readonly _id: string;
    readonly _rev?: string;
    readonly color: types.TagColor;
    readonly count?: number;
    readonly createdAt: number;
    readonly updatedAt: number;
}

export interface Tag extends TagMetadata {
    readonly name: string;
}
