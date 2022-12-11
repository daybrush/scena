import { IObject } from "@daybrush/utils";
import * as React from "react";
import { SceneItem } from "scenejs";

export interface TagAppendInfo {
    tag: any;
    props: IObject<any>;
    name: string;
    frame: IObject<any>;
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

export type ScenaFunctionComponent<T>
    = ((props: T & ScenaProps) => React.ReactElement<any, any>)
    & { scenaComponentId: string };
export type ScenaComponent = React.JSXElementConstructor<ScenaProps> & { scenaComponentId: string };
export type ScenaJSXElement
    = React.ReactElement<any, string>
    | ScenaFunctionJSXElement;
export type ScenaFunctionJSXElement = React.ReactElement<any, ScenaComponent>;
export type ScenaJSXType = ScenaJSXElement | string | ScenaComponent;



export interface FrameInfo {
    frame: IObject<any>;
    order: IObject<any>;
}

export interface ScenaElementLayer {
    type?: "layer";
    id: string;
    scope: string[];
    jsx: React.ReactElement<any, any>;
    item: SceneItem;
    ref: React.MutableRefObject<SVGElement | HTMLElement | null>;
}

export interface ScenaElementLayerGroup {
    type: "group";
    id: string;
    scope: string[];
    children: Array<ScenaElementLayerGroup | ScenaElementLayer>;
}
