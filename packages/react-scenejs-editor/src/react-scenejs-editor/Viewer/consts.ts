import { prefixCSS } from "framework-utils";

export const EDITOR_CSS = prefixCSS("scenejs-editor-", `
{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
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
.controls {
    position: relative;
    background: #444;
    width: 100%;
    min-height: 35px;
    padding-left: 35px;
    box-sizing: border-box;
    border-bottom: 1px solid #333;
}
.control {
    display: inline-block;
    height: 35px;
    line-height: 35px;
    margin-right: 10px;
}
.control span {
    font-weight: bold;
    font-size: 10px;
    color: #fff;
    padding-right: 8px;
}
.control input {
    color: #fff;
    background: #333;
    border: 0;
    border-radius: 3px;
    width: 60px;
    height: 20px;
    box-sizing: border-box;
    padding-left: 8px;
}
.box {
    position: relative;
    width: 31px;
    height: 31px;
    background: #444;
    box-sizing: border-box;
    z-index: 10;
    border: 1px solid #777;
    border-top: 0;
    border-left: 0;
}

.container {
    background: rgba(200, 200, 200, 0.1);
}


.guidelines {
    position: absolute;
    top: 0;
    left: 0;
}
.guideline {
    position: absolute;
    background: #f33;
    z-index: 2;
}

.guideline.dragging:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.guideline.horizontal {
    width: 100vw;
    height: 1px;
    cursor: row-resize;
}

.guideline.vertical {
    width: 1px;
    height: 100vh;
    cursor: col-resize;
}
.mobile .guideline.horizontal {
    transform: scale(1, 2);
}
.mobile .guideline.vertical {
    transform: scale(2, 1);
}
.guideline.horizontal:before {
    height: 20px;
}

.guideline.vertical:before {
    width: 20px;
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
