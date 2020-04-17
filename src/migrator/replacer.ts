import * as models from '../models';
import * as img from './image';

export function header(content: string): string {
    return content.replace(/^\s*#[^\n]+?\n\n?/, '');
}

export function image(content: string, image: img.Image, file: models.File): string {
    const { match } = image;
    const { _id, name } = file;

    // `id` is "file:XXX..."
    const link = `![${name}](inkdrop://${_id})`;

    const regexp = new RegExp(escapeRegExp(match), 'g');
    return content.replace(regexp, link);
}

function escapeRegExp(str: string): string {
    return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
