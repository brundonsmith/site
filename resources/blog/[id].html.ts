import layout from "../../layout.ts";
import { html } from "../../utils.ts";

export const getParams = async () => {
    return ['a', 'b']
}

export default (id: string) => layout(undefined, undefined, html`
`)