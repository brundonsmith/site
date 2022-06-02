import { html } from "../utils.ts";
import layout from '../layout.ts';
import { artImg, isArt, sortedArt } from "./art.html.ts";
import { publishedPosts } from "../posts.ts";

const sortedAll = [
    ...sortedArt,
    ...publishedPosts
].sort((a, b) => b.meta.date.valueOf() - a.meta.date.valueOf())

export default async () => layout(undefined, undefined, html`
<div class="content">
    <div class="hero-section">
        <img src="/static/img/me.jpg" alt="a picture of me">

        <div class="spacer large"></div>
        
        <div class="about shaded">
            <h1>
                Hi, I'm Brandon!
            </h1>

            <div class="spacer large"></div>
        
            <p>
                klasdfhsdklfgjhsldkfghlkh
            </p>
        </div>
    </div>

    <div class="spacer large"></div>
    
    <div class="spacer large"></div>
        
    <h2 class="up-to">
        What I've been up to
    </h2>

    <div class="spacer large"></div>
        
    <div class='items'>
        ${sortedAll
        .map(item =>
            isArt(item)
                ? artImg(item)
                : blogPostTile(item))
        .join('')}
    </div>
</div>
`)

const blogPostTile = (item: typeof publishedPosts[number]) => html`
    <a href="${item.meta.url ?? item.meta.href ?? ''}" class="post-tile shaded">
        ${item.meta.title}
    </a>
`