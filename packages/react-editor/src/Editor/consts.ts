import { createContext } from "react";
import Editor from "./Editor";

export const EDITOR_PROPERTIES = [
    "memory",
    "eventBus",
    "keyManager",
    "moveableData",
    "moveableManager",
    "historyManager",
    "console",
    "getViewport",
    "getSelecto",
    "getEditorElement",
    "getSelectedTargets",
    "selectMenu",
    "getSelectedFrames",
] as const;
export const PREFIX = "scena-";
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
    --mainColor: #4af;
    --back1: #1a1a1a;
    --back2: #2a2a2a;
    --back3: #333;
    --back4: #444;
    --back5: #555;
    --back6: #666;
    transform-style: preserve-3d;

    --menu: 45px;

    --tabs: 40px;
    --tab: 200px;
}

[class*="scena-"] {
    font-family: "Open Sans", sans-serif;
}

.scena-viewer {
    position: absolute !important;
    left: calc(30px + var(--menu));
    top: 30px;
    width: calc(100% - 30px - var(--menu) - var(--tabs));
    height: calc(100% - 30px);
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
    pointer-events: none;
}

.scena-guides {
    position: absolute !important;
    top: 0;
    left: 0;
    transform: translateZ(1px);
}

.scena-guides.scena-horizontal {
    left: calc(var(--menu) + 30px);
    width: calc(100% - 30px - var(--menu) - var(--tabs));
    height: 30px !important;
}

.scena-guides.scena-vertical {
    top: 30px;
    left: var(--menu);
    height: calc(100% - 30px);
    width: 30px !important;
}

.scena-reset {
    position: absolute !important;
    background: var(--back3);
    width: 30px;
    height: 30px;
    z-index: 1;
    border-right: 1px solid var(--back4);
    border-bottom: 1px solid var(--back4);
    box-sizing: border-box;
    cursor: pointer;
    left: var(--menu);
    top: 0px;
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
    background: var(--mainColor);
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
    background: var(--back3);
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
    border-bottom: 1px solid var(--back2);
    font-weight: bold;;
}
.scena-popup li:hover {
    background: #fff;
    color: var(--back2);
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

.scena-align {
    position: relative;
    width: 25px;
    height: 25px;
    /* background: #f55; */
    display: inline-block;
    margin-right: 5px;
}
.scena-align:hover {
    cursor: pointer;
}
.scena-align:hover * {
    background: white;
}
.scena-align-line,
.scena-align-element1,
.scena-align-element2 {
    position: absolute;
    left: 50%;
    top: 50%;
    background: var(--back6);
    transform: translate(-50%, -50%);
}
.scena-align-vertical .scena-align-line {
    width: 1px;
    height: 18px;
}
.scena-align-vertical .scena-align-element1 {
    width: 10px;
    height: 5px;
    margin-top: -3.5px;
}
.scena-align-vertical .scena-align-element2 {
    width: 14px;
    height: 5px;
    margin-top: 3.5px;
}
.scena-align-vertical.scena-align-start .scena-align-line {
    margin-left: -7px;
}
.scena-align-vertical.scena-align-start .scena-align-element1 {
    margin-left: -2px;
}

.scena-align-vertical.scena-align-end .scena-align-line {
    margin-left: 7px;
}
.scena-align-vertical.scena-align-end .scena-align-element1 {
    margin-left: 2px;
}



.scena-align-horizontal .scena-align-line {
    height: 1px;
    width: 18px;
}
.scena-align-horizontal .scena-align-element1 {
    height: 10px;
    width: 5px;
    margin-left: -3.5px;
}
.scena-align-horizontal .scena-align-element2 {
    height: 14px;
    width: 5px;
    margin-left: 3.5px;
}
.scena-align-horizontal.scena-align-start .scena-align-line {
    margin-top: -7px;
}
.scena-align-horizontal.scena-align-start .scena-align-element1 {
    margin-top: -2px;
}

.scena-align-horizontal.scena-align-end .scena-align-line {
    margin-top: 7px;
}
.scena-align-horizontal.scena-align-end .scena-align-element1 {
    margin-top: 2px;
}
`;

export const EditorContext = createContext<Editor | null>(null);
