import { prefixCSS } from "framework-utils";

export const EDITOR_CSS = prefixCSS("scenejs-editor-", `
{
    position: absolute;
    left: 10%;
    top: 10%;
    width: 80%;
    height: 80%;
    z-index: 1;
    overflow: hidden;
    font-family: sans-serif;
}

.label {
    position: fixed;
    top: 0;
    left: 0;
    padding: 3px 6px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;
    color: #fff;
    font-weight: bold;
    font-size: 12px;
    display: none;
    transform: translate(-100%, -100%);
}

.target {
    position: absolute;
    margin: 0;
    z-index: 1;
}
`);

export const RANGE = 500;
