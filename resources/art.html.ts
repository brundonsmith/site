import layout from "../layout.ts";
import { html } from "../utils.ts";

import art from '../art.json' assert { type: "json" }

export const sortedArt = art
    .map(a => ({ ...a, meta: { ...a.meta, date: new Date(a.meta.date) } }))
    .sort((a, b) => b.meta.date.valueOf() - a.meta.date.valueOf())

export default () => layout(undefined, undefined, html`
<div class="content">
    <div class="shaded">
        <h1 class="no-margin">
            Art
        </h1>

        <div class="spacer large"></div>

        <p class="no-margin">
            I sometimes make things in Blender (3D), Procreate (drawing/painting), 
            or Pixel Studio (pixel art). I'm still learning, but it makes me happy!
        </p>
    </div>

    <div class="spacer large"></div>

    <div class='items'>
        ${sortedArt.map(artImg).join('')}
    </div>
</div>
`)

export const artImg = ({ smallImgPath, largeImgPath }: typeof sortedArt[number]) => html`
<div class="art-img shaded" data-smallpath="${smallImgPath}" data-largepath="${largeImgPath}">
    <img src="${smallImgPath}">
</div>
`

export const isArt = (a: unknown): a is { smallImgPath: string, largeImgPath: string } =>
    typeof (a as any).smallImgPath === 'string' && typeof (a as any).largeImgPath === 'string'