export const EDITOR_PROPERTIES = [
    "memory",
    "eventBus",
    "keyManager",
    "moveableData",
    "moveableManager",
    "historyManager",
    "getViewport",
    "getSelecto",
    "getEditorElement",
    "getSelectedTargets",
    "selectMenu",
    "getSelectedFrames",
] as const;
export const PREFIX = "scena-";
export const SCENA_LAYER_SEPARATOR = "//__$__//";
export const DATA_SCENA_ELEMENT_ID = "data-scena-element-id";
export const DATA_SCENA_ELEMENT = "data-scena-element";

export const TYPE_SCENA_LAYERS = "application/x-scena-layers";

export const EDITOR_CSS = `
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,600&display=swap");

{
    position: relative;
    width: 100%;
    height: 100%;
    font-family: sans-serif;
    --scena-editor-color-main: #4af;
    --scena-editor-color-selected: #5bf;
    --scena-editor-color-back1: #1a1a1a;
    --scena-editor-color-back2: #2a2a2a;
    --scena-editor-color-back3: #333;
    --scena-editor-color-back4: #444;
    --scena-editor-color-back5: #555;
    --scena-editor-color-back6: #666;
    transform-style: preserve-3d;

    --scena-editor-size-tools: 45px;
    --scena-editor-size-guides: 30px;
    --scena-editor-size-tabs: 250px;
}

[class*="scena-"] {
    font-family: "Open Sans", sans-serif;
}

.scena-viewer {
    position: absolute !important;
    left: var(--scena-editor-size-guides);
    top: calc(var(--scena-editor-size-guides) + var(--scena-editor-size-tools));
    width: calc(100% - var(--scena-editor-size-guides) - var(--scena-editor-size-tabs));
    height: calc(100% - var(--scena-editor-size-guides) - var(--scena-editor-size-tools));
}

.scena-viewport-container {
    position: relative;
}
.scena-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.scena-viewport:before {
    content: "";
    position: absolute;
    border: 1px solid #eee;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    pointer-events: none;
}


.scena-viewer-move {
    cursor: grab;
}

.scena-viewer-move .scena-viewport {
    pointer-events: none;
}



.scena-guides-manager {
    position: absolute !important;
    top: var(--scena-editor-size-tools);
    left: 0;
    transform: translateZ(1px);
}

.scena-guides-manager.scena-guides-horizontal {
    left: var(--scena-editor-size-guides);
    width: calc(100% - var(--scena-editor-size-guides));
    height: var(--scena-editor-size-guides) !important;
}

.scena-guides-manager.scena-guides-vertical {
    top: calc(var(--scena-editor-size-guides) + var(--scena-editor-size-tools));
    height: calc(100% - var(--scena-editor-size-guides) - var(--scena-editor-size-tools));
    width: var(--scena-editor-size-guides) !important;
}

.scena-reset {
    position: absolute !important;
    background: var(--scena-editor-color-back3);
    width: var(--scena-editor-size-guides);
    height: var(--scena-editor-size-guides);
    z-index: 1;
    border-right: 1px solid var(--scena-editor-color-back4);
    border-bottom: 1px solid var(--scena-editor-color-back4);
    box-sizing: border-box;
    cursor: pointer;
    left: 0;
    top: var(--scena-editor-size-tools);
}

.scena-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0, 0, 0, 0.2);
}
.moveable-dimension {
    position: absolute;
    background: var(--scena-editor-color-main);
    border-radius: 2px;
    padding: 1px 3px;
    color: white;
    font-size: 13px;
    white-space: nowrap;
    font-weight: bold;
    will-change: transform;
    transform: translate(-50%) translateZ(0px);
}
.scena-frame-tab {
    overflow: auto;
    max-height: 300px;
}

.scena-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    transform-style: preserve-3d;
    transform: translateZ(15px);
    background: rgba(0, 0, 0, 0.2);
}

.scena-popup {
    position: absolute;
    max-width: 600px;
    width: 80%;
    max-height: 1000px;
    padding: 30px;
    height: 80%;
    overflow: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    background: var(--scena-editor-color-back3);
    box-sizing: border-box;
    color: #fff;
}
.scena-popup h2 {
    padding: 0;
    margin: 0;
    padding: 4px;
}
.scena-popup .scena-close {
    position: absolute;
    top: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    cursor: pointer;
}
.scena-popup .scena-close:before, .scena-popup .scena-close:after {
    content: "";
    position: absolute;
    width: 30px;
    height: 1px;
    background: #ddd;
    top: 50%;
    left: 50%;
}
.scena-popup .scena-close:hover:before, .scena-popup .scena-close:hover:after {
    height: 2px;
    background: #fff;
    border-radius: 1px;
}
.scena-popup .scena-close:before {
    transform: translate(-50%, -50%) rotate(45deg);
}
.scena-popup .scena-close:after {
    transform: translate(-50%, -50%) rotate(-45deg);
}
.scena-popup ul {
    list-style: none;
    padding: 0;
}
.scena-popup li {
    padding: 4px 10px;
    border-bottom: 1px solid var(--scena-editor-color-back2);
    font-weight: bold;;
}
.scena-popup li:hover {
    background: #fff;
    color: var(--scena-editor-color-back2);
}
.scena-popup p {
    position: relative;
    padding: 2px 0px;
}
.scena-popup strong {
    position: absolute;
    right: 0;
    text-transform: uppercase;
}
.scena-popup strong span {
    display: inline-block;
    padding: 2px 4px;
    border: 1px solid #fff;
    vertical-align: top;
    margin: 0px 5px;
}

`;
