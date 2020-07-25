import * as React from "react";
import { IObject, find, findIndex, isString } from "@daybrush/utils";
import { prefix, getId, getScenaAttrs } from "../utils/utils";
import { isNumber } from "util";
import { DATA_SCENA_ELEMENT_ID } from "../consts";
import { ScenaJSXElement, ScenaComponent } from "../types";

export interface AddedInfo {
    added: ElementInfo[];
}
export interface RemovedInfo {
    removed: ElementInfo[];
}
export interface ElementInfo {
    jsx: ScenaJSXElement;
    name: string;
    frame?: IObject<any>;

    scopeId?: string;
    children?: ElementInfo[];
    attrs?: IObject<any>;
    componentId?: string;
    jsxId?: string;
    el?: HTMLElement | null;
    id?: string;
    index?: number;
    innerText?: string;
    innerHTML?: string;
}
export default class Viewport extends React.PureComponent<{
    style: IObject<any>,
    onBlur: (e: any) => any,
}> {
    public components: IObject<ScenaComponent> = {};
    public jsxs: IObject<ScenaJSXElement> = {};
    public viewport: ElementInfo = {
        jsx: <div></div>,
        name: "Viewport",
        id: "viewport",
        children: [],
    };
    public ids: IObject<ElementInfo> = {
        viewport: this.viewport,
    };
    public state = {};
    public render() {
        const style = this.props.style;
        return <div className={prefix("viewport")} onBlur={this.props.onBlur} style={style}>
            {this.props.children}
            {this.renderChildren(this.getViewportInfos())}
        </div>;
    }
    public renderChildren(children: ElementInfo[]): ScenaJSXElement[] {
        return children.map(info => {
            const jsx = info.jsx;
            const nextChildren = info.children;
            if (!nextChildren || !nextChildren.length || !isString(jsx.type)) {
                return jsx;
            }
            const children = jsx.props.children || [];
            return React.cloneElement(jsx, jsx.props, ...children, ...this.renderChildren(nextChildren)) as ScenaJSXElement;
        });
    }
    public getJSX(id: string) {
        return this.jsxs[id];
    }
    public getComponent(id: string) {
        return this.components[id];
    }

    public makeId() {
        const ids = this.ids;

        while (true) {
            const id = `scena${Math.floor(Math.random() * 100000000)}`;

            if (ids[id]) {
                continue;
            }
            return id;
        }
    }
    public setInfo(id: string, info: ElementInfo) {
        const ids = this.ids;

        ids[id] = info;
    }
    public getInfo(id: string) {
        return this.ids[id];
    }

    public getLastChildInfo(id: string) {
        const info = this.getInfo(id);
        const children = info.children!;

        return children[children.length - 1];
    }
    public getNextInfo(id: string) {
        const info = this.getInfo(id);
        const parentInfo = this.getInfo(info.scopeId!)!;
        const parentChildren = parentInfo.children!;
        const index = parentChildren.indexOf(info);

        return parentChildren[index + 1];
    }
    public getPrevInfo(id: string) {
        const info = this.getInfo(id);
        const parentInfo = this.getInfo(info.scopeId!)!;
        const parentChildren = parentInfo.children!;
        const index = parentChildren.indexOf(info);

        return parentChildren[index - 1];
    }
    public getInfoByElement(el: HTMLElement | SVGElement) {
        return this.ids[getId(el)];
    }
    public getInfoByIndexes(indexes: number[]) {
        return indexes.reduce((info: ElementInfo, index: number) => {
            return info.children![index];
        }, this.viewport);
    }
    public getElement(id: string) {
        const info = this.getInfo(id);

        return info ? info.el : null;
    }
    public getViewportInfos() {
        return this.viewport.children!;
    }
    public getIndexes(target: HTMLElement | SVGElement | string): number[] {
        const info = (isString(target) ? this.getInfo(target) : this.getInfoByElement(target))!;

        if (!info.scopeId) {
            return [];
        }
        const parentInfo = this.getInfo(info.scopeId)!;

        return [...this.getIndexes(info.scopeId), parentInfo.children!.indexOf(info)];
    }
    public registerChildren(jsxs: ElementInfo[], parentScopeId?: string) {
        return jsxs.map(info => {
            const id = info.id || this.makeId();
            const jsx = info.jsx;
            const children = info.children || [];
            const scopeId = parentScopeId || info.scopeId || "viewport";
            let componentId = "";

            const props: IObject<any> = {
                "key": id,
            };
            if (typeof jsx.type === "string") {
                props[DATA_SCENA_ELEMENT_ID] = id;
            } else {
                const component = jsx.type;
                componentId = component.scenaComponentId;
                props.scenaElementId = id;
                props.scenaAttrs = info.attrs || {};
                props.scenaText = info.innerText;
                props.scenaHTML = info.innerHTML;
                this.components[componentId] = component;
            }
            const elementInfo: ElementInfo = {
                ...info,
                jsx: React.cloneElement(info.jsx, props) as ScenaJSXElement,
                children: this.registerChildren(children, id),
                scopeId,
                componentId,
                frame: info.frame || {},
                el: null,
                id,
            };
            this.setInfo(id, elementInfo);
            return elementInfo;
        });
    }
    public appendJSXs(jsxs: ElementInfo[], appendIndex: number, scopeId?: string): Promise<AddedInfo> {
        const jsxInfos = this.registerChildren(jsxs);

        jsxInfos.forEach((info, i) => {
            const scopeInfo = this.getInfo(scopeId || info.scopeId!);
            const children = scopeInfo.children!;

            if (appendIndex > -1) {
                children.splice(appendIndex + i, 0, info);
                info.index = appendIndex + i;
            } else if (isNumber(info.index)) {
                children.splice(info.index, 0, info);
            } else {
                info.index = children.length;
                children.push(info);
            }
        });

        return new Promise(resolve => {
            this.forceUpdate(() => {
                const infos = jsxInfos.map(function registerElement(info) {
                    const id = info.id!;

                    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`)!;
                    const attrs = info.attrs || {};

                    info.el = target;

                    for (const name in attrs) {
                        target.setAttribute(name, attrs[name]);
                    }
                    info.attrs = getScenaAttrs(target);
                    const children = info.children || [];

                    if (children.length) {
                        children.forEach(registerElement);
                    } else if (info.attrs!.contenteditable) {
                        if ("innerText" in info) {
                            (target as HTMLElement).innerText = info.innerText || "";
                        } else {
                            info.innerText = (target as HTMLElement).innerText || "";
                        }
                    } else if (!info.componentId) {
                        if ("innerHTML" in info) {
                            target.innerHTML = info.innerHTML || "";
                        } else {
                            info.innerHTML = target.innerHTML || "";
                        }
                    }
                    return { ...info };
                });
                resolve({
                    added: infos,
                });
            });
        });
    }
    public getIndex(id: string | HTMLElement) {
        const indexes = this.getIndexes(id);
        const length = indexes.length;
        return length ? indexes[length - 1] : -1;
    }
    public getElements(ids: string[]) {
        return ids.map(id => this.getElement(id)).filter(el => el) as Array<HTMLElement | SVGElement>;
    }
    public unregisterChildren(children: ElementInfo[], isChild?: boolean): ElementInfo[] {
        const ids = this.ids;

        return children.slice(0).map(info => {
            const target = info.el!;
            let innerText = "";
            let innerHTML = "";

            if (info.attrs!.contenteditable) {
                innerText = (target as HTMLElement).innerText;
            } else {
                innerHTML = target.innerHTML;
            }

            if (!isChild) {
                const parentInfo = this.getInfo(info.scopeId!);
                const parentChildren = parentInfo.children!;
                const index = parentChildren.indexOf(info);
                parentInfo.children!.splice(index, 1);
            }
            const nextChildren = this.unregisterChildren(info.children!, true);

            delete ids[info.id!];
            delete info.el;

            return {
                ...info,
                innerText,
                innerHTML,
                attrs: getScenaAttrs(target),
                children: nextChildren,
            };
        });
    }
    public removeTargets(targets: Array<HTMLElement | SVGElement>): Promise<RemovedInfo> {
        const removedChildren = targets.map(target => {
            return this.getInfoByElement(target);
        }).filter(info => info) as ElementInfo[];
        const indexes = removedChildren.map(info => this.getIndex(info.id!));
        const removed = this.unregisterChildren(removedChildren);

        removed.forEach((info, i) => {
            info.index = indexes[i];
        })
        return new Promise(resolve => {
            this.forceUpdate(() => {
                resolve({
                    removed,
                });
            })
        });
    }
}
