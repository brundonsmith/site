import { path, MarkdownIt } from "../../deps.ts";
// import prism from '../../markdown-it-prism.ts'
import layout from "../../layout.ts";
import { BASE_URL, collect, getFirstParagraph, html, projectPath } from "../../utils.ts";
import externalPosts from '../../blog-posts/external.json' assert { type: "json" }

// @ts-ignore
const markdownRenderer = new MarkdownIt({
    html: true,
})

const metaExpr = /^---\n([^]*)\n---\n/m
const blogPostsDir = path.resolve(projectPath, 'blog-posts')

const allPosts = await(async () => {
    const allPosts: {
        meta: {
            title: string,
            description: string | null | undefined,
            date: Date,
            tags: string[],
            url?: string,
            href?: string,
            test: boolean
        },
        id?: string,
        content?: string
    }[] = await Promise.all(
        (await collect(Deno.readDir(blogPostsDir)))
            .filter(file => path.extname(file.name) === '.md')
            .map(async file => {
                const filePath = path.resolve(blogPostsDir, file.name)
                const id = file.name.replace('.md', '')

                const contents = await Deno.readTextFile(filePath)
                const metaStr = metaExpr.exec(contents)?.[1]
                const markdown = contents.replace(metaExpr, '')

                const metaAttrExpr = /^([a-z]+):[\s]*(.*)[\s]*$/mig
                const rawMeta: Record<string, unknown> = {}

                if (!metaStr) throw Error('No metadata provided for post ' + id)

                let res
                // deno-lint-ignore no-cond-assign
                while (res = metaAttrExpr.exec(metaStr)) {
                    const [_, key, value] = res

                    try {
                        rawMeta[key] = JSON.parse(value)
                    } catch {
                        rawMeta[key] = value
                    }
                }

                const { title, description, tags, date, test } = rawMeta

                if (typeof title !== 'string') throw Error(`No title provided for post ${id}`)
                if (typeof date !== 'string') throw Error(`No date provided for post ${id}`)

                const content = markdownRenderer.render(markdown).replaceAll(/ aria-hidden="true"/gi, '') as string

                return {
                    meta: {
                        title,
                        description: typeof description === 'string' ? description : getFirstParagraph(content),
                        date: new Date(date),
                        tags: Array.isArray(tags) ? tags : [],
                        test: test === true,
                        url: BASE_URL + "/blog/" + id
                    },
                    id,
                    content
                }
            }))

    allPosts.push(...externalPosts.map(({ meta: { title, date, tags, href } }) => ({
        meta: {
            title,
            description: undefined,
            date: new Date(date),
            tags,
            href,
            test: false
        }
    })))

    allPosts.sort((a, b) => b.meta.date.valueOf() - a.meta.date.valueOf())

    return allPosts
})()

export const publishedPosts = allPosts.filter(p => !p.meta.test)
export const localPosts = publishedPosts.filter(p => p.content)

export const params = localPosts.map(post => post.id).filter(id => id != null)

import fourOhFour from '../404.html.ts'

export default (id: string) => {
    const post = publishedPosts.find(p => p.id === id)

    if (post == null) return fourOhFour()

    return layout(post.meta.title, post.meta.description, html`
    <article class="content">
        ${post.meta.title ?
            html`
            <h1>
                ${post.meta.title}
            </h1>
            <div class="spacer large"></div>
            `
            : ''}

        ${post.content ?? ''}
    </article>
    `)
}