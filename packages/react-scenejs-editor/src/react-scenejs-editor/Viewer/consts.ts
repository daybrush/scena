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
.viewer {
    position: absolute;
    left: 30px;
    top: 30px;
    width: calc(100% - 30px);
    height: calc(100% - 30px);
    overflow: scroll;
}
.viewer .scroller {
    position: absolute;
    width: 100%;
    height: 100%;
}
.viewer .container-area {
    position: absolute;
    background: #f55;
    width: 100%;
    height: 100%;
}
.box {
    position: relative;
    width: 30px;
    height: 30px;
    background: #444;
    box-sizing: border-box;
    z-index: 10;
}
.box:before, .box:after {
    position: absolute;
    content: "";
    background: #777;
}
.box:before {
    width: 1px;
    height: 100%;
    left: 100%;
}
.box:after {
    height: 1px;
    width: 100%;
    top: 100%;
}
.container {
    transform-origin: 0% 0%;
    background: rgba(200, 200, 200, 0.2);
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
    /* left: calc(50% - 125px);
    top: calc(50% - 250px); */
}
`);

export const RANGE = 500;
