import { fs, path } from "./deps.ts";

export const html = (segments: TemplateStringsArray, ...inserts: string[]) =>
    segments
        .map((s, i) =>
            i < segments.length - 1
                ? s + (inserts[i] ?? '')
                : s)
        .join('')
        .trim()

export const given = <T, R>(val: T | null | undefined, func: (val: T) => R): R | null | undefined =>
    val != null
        ? func(val)
        : val as null | undefined

export const log = <T>(val: T): T => {
    console.log(val);
    return val;
}

export const collect = async <T>(iter: AsyncIterable<T>): Promise<T[]> => {
    const results: T[] = []

    for await (const result of iter) {
        results.push(result)
    }

    return results
}

export const projectPath = path.dirname(path.fromFileUrl(import.meta.url))
export const resourcesDir = path.resolve(projectPath, 'resources')
export const allResources = await collect(fs.walk(resourcesDir, { includeDirs: false }))


const FIRST_PARAGRAPH_EXPRESSION = /<p>((?:.|[\r\n])*?)<\/p>/im;
const TAGS_EXPRESSION = /<\/?[^>]+>/ig;
export const getFirstParagraph = (html: string) =>
    given(new RegExp(FIRST_PARAGRAPH_EXPRESSION).exec(html), result =>
        given(result[1], blurb =>
            blurb.trim().replace(new RegExp(TAGS_EXPRESSION), '')))

export const DEFAULT_TITLE = `Brandon's Website`;
export const DEFAULT_DESCRIPTION = `Personal website of Brandon Smith`;
export const DOMAIN = `www.brandons.me`;
export const BASE_URL = `https://${DOMAIN}`