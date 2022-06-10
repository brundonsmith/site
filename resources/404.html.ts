import layout from "../layout.ts";
import { html } from "../utils.ts";

export default () => layout(undefined, undefined, html`
    <div class="spacer large"></div>
    <div class="content shaded">
        <h1>
            Whoops! This page doesn't exist.
        </h1>
    </div>
`)