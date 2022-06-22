import layout from "../../layout.ts";
import { localPosts } from "../../posts.ts";
import { html } from "../../utils.ts";
import fourOhFour from '../404.html.ts'


export const params = localPosts.map(post => post.id).filter((id): id is string => id != null)

export default (id?: string) => {
    if (id == null) throw Error('Unreachable!')

    const post = localPosts.find(p => p.id === id)

    if (post == null) return fourOhFour()

    return layout(post.meta.title, post.meta.description, html`
    <article class="content">
        <div class="article-body">
            ${post.meta.title ?
            html`
                <h1 class="no-margin">
                    ${post.meta.title}
                </h1>

                <div class="spacer small"></div>

                <div class="datestamp">
                    ${post.meta.date.toDateString()}
                </div>
                `
            : ''}

            ${post.content ?? ''}
        </div>
    </article>
    `)
}