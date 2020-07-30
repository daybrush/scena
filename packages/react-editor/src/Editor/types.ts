import { IObject } from "@daybrush/utils";
import Memory from "./utils/Memory";
import EventBus from "./utils/EventBus";
import MoveableData from "./utils/MoveableData";
import MoveableManager from "./Viewport/MoveableMananger";
import KeyManager from "./KeyManager/KeyManager";
import Editor from "./Editor";
import HistoryManager from "./utils/HistoryManager";
import Debugger from "./utils/Debugger";
import * as React from "react";

export interface ScenaEditorState {
    selectedTargets: Array<SVGElement | HTMLElement>;
    horizontalGuides: number[];
    verticalGuides: number[];
    selectedMenu: string;
    zoom: number;
}

export interface TagAppendInfo {
    tag: any;
    props: IObject<any>;
    name: string;
    frame: IObject<any>;
}


export interface EditorInterface {
    editor: Editor;
    memory: Memory;
    eventBus: EventBus;
    moveableData: MoveableData;
    keyManager: KeyManager;
    historyManager: HistoryManager;
    console: Debugger;
    moveableManager: React.RefObject<MoveableManager>;
}

export interface Clipboard {
    write(items: ClipboardItem[]): Promise<void>;
}
export interface ClipboardItem {
    types: string[];
    getType(type: string): Promise<Blob>;
}


export interface SavedScenaData {
    name: string;
    jsxId: string;
    componentId: string;
    tagName: string;
    innerHTML?: string;
    innerText?: string;
    attrs: IObject<any>;
    frame: IObject<any>;
    children: SavedScenaData[];
}
export interface ScenaProps {
    scenaElementId?: string;
    scenaAttrs?: IObject<any>;
    scenaText?: string;
    scneaHTML?: string;
}

export type ScenaFunctionComponent<T> = ((props: T & ScenaProps) => React.ReactElement<any, any>) & { scenaComponentId: string };
export type ScenaComponent = React.JSXElementConstructor<ScenaProps> & { scenaComponentId: string };
export type ScenaJSXElement
    = React.ReactElement<any, string>
    | ScenaFunctionJSXElement;
export type ScenaFunctionJSXElement = React.ReactElement<any, ScenaComponent>;
export type ScenaJSXType = ScenaJSXElement | string | ScenaComponent;
