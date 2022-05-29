import { path } from "./deps.ts";

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

export const projectPath = path.dirname(path.fromFileUrl(import.meta.url))