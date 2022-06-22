import { fs, path, server, compress } from './deps.ts'
import { allResources, projectPath, resourcesDir } from "./utils.ts";
import routes from './routes-manifest.ts'

const ONE_MINUTE = 60

const extToContentType: Record<string, string> = {
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpg',
    '.png': 'image/png',

    '.html': 'text/html',
    '.xml': 'text/rss+xml',
    '.css': 'text/css',

    '.js': 'application/javascript',
    '.json': 'application/json',

    '.ttf': 'font/ttf',
}

const textFileTypes = new Set(['.html', '.xml', '.css', '.js', '.json', '.ttf'])

const parameterPattern = /\/\[[^/]+\](?:\.[a-z]+)$/

const fileContents = new Map<string, { headers: HeadersInit, content: Uint8Array }>()

function createEntry(filePath: string, content: Uint8Array | string) {
    const ext = path.extname(filePath)
    const contentType = extToContentType[ext]
    const isCompressable = textFileTypes.has(ext)

    const encodedContent = typeof content === 'string'
        ? new TextEncoder().encode(content)
        : content

    const baseHeaders = {
        'Content-Type': contentType,
        'Cache-Control': `max-age=${5 * ONE_MINUTE}`,
    }

    return {
        content: isCompressable
            ? compress(encodedContent)
            : encodedContent,
        headers: (
            isCompressable
                ? {
                    ...baseHeaders,
                    'Content-Encoding': 'br'
                }
                : baseHeaders
        )
    }
}

function htmlFileToRoute(path: string) {
    const withoutExtension = path.replace(/.html$/, '')
    const route = (
        withoutExtension === '/index' ? '/' :
            withoutExtension.endsWith('/index') ? withoutExtension.replace(/\/index$/, '') :
                withoutExtension
    )

    return route
}

// load resources
await Promise.all(
    allResources.map(async file => {
        const ext = path.extname(file.path)
        const resourcePath = '/' + path.relative(resourcesDir, file.path)

        if (ext === '.ts') {
            const generatedFilePath = resourcePath.replace(/.ts$/, '')
            const module = routes['./' + path.relative(projectPath, file.path)]
            const { default: renderFn, params } = module

            if (generatedFilePath.match(parameterPattern) && params) {
                for (const param of params) {
                    const parameterizedGeneratedFilePath = generatedFilePath.replace(parameterPattern, '/' + param)

                    fileContents.set(htmlFileToRoute(parameterizedGeneratedFilePath), createEntry(
                        parameterizedGeneratedFilePath,
                        await renderFn(param)
                    ))
                }
            } else {
                fileContents.set(htmlFileToRoute(generatedFilePath), createEntry(
                    generatedFilePath,
                    await renderFn()
                ))
            }
        } else {
            fileContents.set(resourcePath, createEntry(
                file.path,
                await Deno.readFile(file.path)
            ))
        }
    })
)

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

if (Deno.args.some(arg => arg === '--watch')) {
    for await (const change of Deno.watchFs(projectPath, { recursive: true })) {
        if (change.paths.some(path => !path.includes('.git'))) {
            Deno.run({ cmd: ['deno', 'run', '--allow-all', '--no-check', import.meta.url, '--watch'] })
            Deno.exit(0)
        }
    }
}