import { path } from "./deps.ts";
import { html, projectPath } from "./utils.ts";

const SITE_TITLE = 'brandons.me'
const SITE_DESCRIPTION = 'Brandon\'s site'

const styles = await Deno.readTextFile(path.resolve(projectPath, 'resources/static/styles/all.css'))

export default (title: string | null | undefined, description: string | null | undefined, content: string) => html`
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>${title ? `${title} | ${SITE_TITLE}` : SITE_TITLE}</title>
        <meta name="description" content="${description || SITE_DESCRIPTION}">

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>${styles}</style>
        <link href="/static/styles/prism.css" rel="stylesheet">
        
        <script src="/static/js/app.js"></script>
    </head>
    
    <body>
        <header>
            <div class="header-content">
                ${link('Home', '/', '/static/img/home.png', 'home')}

                ${link('Projects', '/projects',
    'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcohenwoodworking.com%2Fwp-content%2Fuploads%2F2016%2F09%2Fimage-placeholder-500x500.jpg&f=1&nofb=1', 'foo')}
                
                ${link('Writing', '/writing', '/static/img/coffee.png', 'coffee cup')}
                
                ${link('Art', '/art', '/static/img/art.png', 'painter\'s palette')}
                
                <a href="/blog">
                    &lt;/&gt;
                    
                    Dev Blog
                </a>

                <a href="/feed.xml" rel="noopener" title="RSS" aria-label="RSS">
                    <img src="/static/img/rss.png" alt='RSS icon'>
                    
                    RSS
                </a>
            </div>
        </header>

        ${content}

        <div class="spacer large"></div>
        <div class="spacer large"></div>

        <script src="/static/js/prism.js"></script>
    </body>
</html>
`

const link = (label: string, href: string, image: string, imageAlt: string) => html`
<a href="${href}">
    <img src="${image}" alt="${imageAlt}">
    
    ${label}
</a>
`