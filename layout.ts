import { path } from "./deps.ts";
import { html, projectPath } from "./utils.ts";

const SITE_TITLE = 'brandons.me'
const SITE_DESCRIPTION = 'Brandon\'s site'

const styles = await Deno.readTextFile(path.resolve(projectPath, 'resources/static/styles/all.css'))

export default (title: string | undefined, description: string | undefined, content: string) => html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>${title ? `${title} | ${SITE_TITLE}` : SITE_TITLE}</title>
            <meta name="description" content="${description || SITE_DESCRIPTION}">

            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <style>${styles}</style>
            <script src="/static/js/app.js"></script>
        </head>
        
        <body>
            <header>
                <div class="header-content">
                    ${link('Home', '/',
    'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcohenwoodworking.com%2Fwp-content%2Fuploads%2F2016%2F09%2Fimage-placeholder-500x500.jpg&f=1&nofb=1')}

                    ${link('Projects', '/projects',
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcohenwoodworking.com%2Fwp-content%2Fuploads%2F2016%2F09%2Fimage-placeholder-500x500.jpg&f=1&nofb=1')}
                    
                    ${link('Writing', '/writing', '/static/img/coffee.png')}
                    
                    ${link('Art', '/art',
            'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcohenwoodworking.com%2Fwp-content%2Fuploads%2F2016%2F09%2Fimage-placeholder-500x500.jpg&f=1&nofb=1')}
                    
                    ${link('Dev Blog', '/blog', '/static/img/code.png')}
                    
                </div>
            </header>

            ${content}
        </body>
    </html>
`

const link = (label: string, href: string, image: string) => html`
    <a href="${href}">
        <img src="${image}">
        
        ${label}
    </a>
`