import path from 'path';
import * as bn from './types/boostnote';

interface Image {
    readonly filename: string;
    readonly path: string;
    readonly text: string;
};

export default function extract({ content }: Pick<bn.Note, 'content'>): Image[] {
    if (content == null) return [];
    if (/:storage\//.test(content) === false) return []
    const links = match(content);
    return links.map(({ text, url }) => {
        const filename = path.basename(url);
        return { filename, path: url, text };
    });
}

interface Link {
    readonly text: string;
    readonly url: string;
}

function match(content: string): Link[] {
    const matches = content.matchAll(/\[(.+?)\]\((.+?)\)/g) || [];
    return Array.from(matches).map(([, text, url]) => ({ text, url }));
}
