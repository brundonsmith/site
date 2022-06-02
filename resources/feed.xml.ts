import { localPosts } from "../posts.ts";
import { BASE_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE, getFirstParagraph, given } from "../utils.ts";

const FEED_HREF = '/feed.xml'

export default () => `
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${DEFAULT_TITLE}</title>
        <description>${DEFAULT_DESCRIPTION}</description>
        <link>${BASE_URL}</link>
        <atom:link href="${BASE_URL + FEED_HREF}" rel="self" type="application/rss+xml" />

        ${localPosts.map(post => `
            <item>
                <title>${post.meta.title}</title>
                <link>${BASE_URL + post.meta.url}</link>
                <guid>${BASE_URL + post.meta.url}</guid>
                <pubDate>${post.meta.date.toUTCString()}</pubDate>
                <description>${post.meta.description}</description>
            </item>
        `.trim())
        .join('\n')}
</channel>
</rss>
`.trim()