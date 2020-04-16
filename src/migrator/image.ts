import path from 'path';

export interface Image {
    readonly filename: string;
    readonly match: string;
    readonly text: string;
    readonly url: string;
};

export function extract(content: string): Image[] {
    if (content == null) return [];
    if (/:storage\//.test(content) === false) return []
    const matches = match(content);
    return matches.map(({ all, text, url }) => {
        const filename = path.basename(url);
        return { filename, match: all, text, url };
    });
}

interface Match {
    readonly all: string;
    readonly text: string;
    readonly url: string;
}

function match(content: string): Match[] {
    const matches = content.matchAll(/!\[(.+?)\]\((.+?)\)/g) || [];
    return Array.from(matches).map(([all, text, url]) => ({ all, text, url }));
}
