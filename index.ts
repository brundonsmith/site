
import { fs, path, server } from './deps.ts'
import { projectPath } from "./utils.ts";

const ONE_MINUTE = 60

const extToContentType: Record<string, string> = {
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
    'png': 'image/png',

    'html': 'text/html',
    'xml': 'text/xml',
    'css': 'text/css',

    'js': 'application/javascript',
    'json': 'application/json',

    'ttf': 'font/ttf',
}

const parameterPattern = /\/\[[^/]+\]$/

const fileContents = new Map<string, { headers: HeadersInit, content: Uint8Array }>()

// load resources
const resourcesDir = path.resolve(projectPath, 'resources')
for await (const file of fs.walk(resourcesDir, { includeDirs: false })) {
    const ext = path.extname(file.path)
    const resourcePath = '/' + path.relative(resourcesDir, file.path)

    if (ext === '.ts') {
        const module = await import(file.path)
        const renderFn = module.default

        const pagePath = resourcePath.replace(/.ts$/, '')
        const contentType = extToContentType[path.extname(pagePath)]
        const headers = { 'Content-Type': contentType, 'Cache-Control': `max-age=${5 * ONE_MINUTE}` }

        const route = pagePath.replace(/.html$/, '')
        const x = (
            route === '/index' ? '/' :
                route.endsWith('/index') ? route.replace(/\/index$/, '') :
                    route
        )

        if (x.match(parameterPattern)) {
            const params = await module.getParams()

            for (const param of params) {
                const content = await renderFn(param)
                fileContents.set(x.replace(parameterPattern, '/' + param), { content, headers })
            }
        } else {
            const content = await renderFn()
            fileContents.set(x, { content, headers })
        }
    } else {
        const contentType = extToContentType[ext]
        const headers = { 'Content-Type': contentType, 'Cache-Control': `max-age=${5 * ONE_MINUTE}` }

        const content = await Deno.readFile(file.path)
        fileContents.set(resourcePath, { content, headers })
    }
}

const fourOhFour = fileContents.get('/404') as { headers: HeadersInit, content: Uint8Array }

const port = 8000
const s = new server.Server({
    handler: req => {
        const url = new URL(req.url)
        const pathname = url.pathname

        const file = fileContents.get(pathname)

        if (file) {
            const { content, headers } = file
            return new Response(content, { headers })
        } else {
            const { content, headers } = fourOhFour
            return new Response(content, { headers, status: 404 })
        }
    }
})

s.serve(Deno.listen({ port }))
console.log(`Listening on http://localhost:${port}/`)

for await (const _ of Deno.watchFs(projectPath, { recursive: true })) {
    Deno.run({ cmd: ['deno', 'run', '--allow-all', '--no-check', import.meta.url] })
    Deno.exit(0)
}