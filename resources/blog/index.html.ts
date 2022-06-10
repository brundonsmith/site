import layout from "../../layout.ts";
import { publishedPosts } from "../../posts.ts";
import { html } from "../../utils.ts";

export default () => layout(undefined, undefined, html`
<div class="content">
    <div class="shaded">
        <h1 class="no-margin">
            Dev Blog
        </h1>

        <div class="spacer large"></div>

        <p class="no-margin">
            My thoughts on programming, software-engineering, my own coding
            projects, etc.
        </p>
    </div>

    <div class="spacer large"></div>
    <div class="spacer large"></div>

    ${publishedPosts.map(post => html`
    <a class="post-link shaded" href="${post.meta.href ?? post.meta.url ?? ''}">
        <h3 class="no-margin">
            ${post.meta.title ?? ''}
        </h3>

        <div class="spacer small"></div>

        <div class="datestamp">
            ${post.meta.date.toDateString()}
        </div>
    </a>
    <div class="spacer large"></div>
    `).join('')}
</div>
`)