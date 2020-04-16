export type ImageFileType =
    'image/png' | 'image/jpeg' | 'image/jpg' |
    'image/svg+xml' | 'image/gif' | 'image/heic' | 'image/heif';

export enum NoteStatus {
    NONE = 'none',
    ACTIVE = 'active',
    ON_HOLD = 'onHold',
    COMPLETED = 'completed',
    DROPPED = 'dropped'
}

export enum NoteVisibility {
    PRIVATE = 'private',
    PUBLIC = 'public'
}

export enum TagColor {
    DEFAULT = 'default',
}
