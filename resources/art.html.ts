import layout from "../layout.ts";
import { html, projectPath } from "../utils.ts";
import { path } from '../deps.ts';

const artDir = path.resolve(projectPath, 'resources/static/img/art')

export const sortedArt = await(async () => {
    const paths: ({ imgPath: string, info: Deno.FileInfo })[] = []
    for await (const file of Deno.readDir(artDir)) {
        const imgPath = path.resolve(artDir, file.name)
        paths.push({ imgPath, info: await Deno.stat(imgPath) })
    }

    paths.sort((a, b) => (b.info.mtime?.valueOf() ?? 0) - (a.info.mtime?.valueOf() ?? 0))

    return paths.map(({ imgPath }) => {
        const largePath = '/' + path.relative(path.resolve(projectPath, 'resources'), imgPath)
        const smallPath = largePath.replace('/art/', '/art-small/')

        return {
            largePath,
            smallPath
        }
    })
})()

export default () => layout(undefined, undefined, html`
    <div class="content">
        <div class="shaded">
            <h1>
                Art
            </h1>

            <div class="spacer large"></div>

            <p>
                I sometimes make things in Blender (3D), Procreate (drawing/painting), 
                or Pixel Studio (pixel art). I'm not great at any of them, but I'm
                trying to get better!
            </p>
        </div>

        <div class="spacer large"></div>

        <div class='items'>
            ${sortedArt.map(artImg).join('')}
        </div>
    </div>
`)

export const artImg = ({ smallPath, largePath }: typeof sortedArt[number]) => html`
    <div class="art-img" data-smallpath="${smallPath}" data-largepath="${largePath}">
        <img src="${smallPath}">
    </div>
`
