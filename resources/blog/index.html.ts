import layout from "../../layout.ts";
import { html } from "../../utils.ts";
import { publishedPosts } from "./[id].html.ts";

export default () => layout(undefined, undefined, html`
<div class="content">
    ${publishedPosts.map(post => html`
    <a href="/blog/${post.id ?? ''}">
        ${post.meta.title ?? ''}
    </a>
    `).join('')}
</div>
`)