import layout from "../../layout.ts";
import { publishedPosts } from "../../posts.ts";
import { html } from "../../utils.ts";

export default () => layout(undefined, undefined, html`
<div class="content">
    ${publishedPosts.map(post => html`
    <a class="post-link" href="${post.meta.href ?? post.meta.url ?? ''}">
        <h3>
            ${post.meta.title ?? ''}
        </h3>
    </a>
    <div class="spacer large"></div>
    `).join('')}
</div>
`)