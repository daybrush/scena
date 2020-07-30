import * as React from "react";
import { IObject, isString, isArray } from "@daybrush/utils";
import { prefix, getId, getScenaAttrs, isScenaFunction, isScenaElement, isNumber, isScenaFunctionElement } from "../utils/utils";
import { DATA_SCENA_ELEMENT_ID } from "../consts";
import { ScenaJSXElement, ScenaComponent, ScenaJSXType } from "../types";

export interface AddedInfo {
    added: ElementInfo[];
}
export interface RemovedInfo {
    removed: ElementInfo[];
}
export interface MovedInfo {
    info: ElementInfo;
    parentInfo: ElementInfo;
    prevInfo?: ElementInfo;
}
export interface MovedResult {
    moved: ElementInfo[];
    prevInfos: MovedInfo[];
    nextInfos: MovedInfo[];
}
export interface ElementInfo {
    jsx: ScenaJSXType;
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
    public viewportRef = React.createRef<HTMLDivElement>();
    public render() {
        const style = this.props.style;

        return <div className={prefix("viewport-container")} onBlur={this.props.onBlur} style={style}>
            {this.props.children}
            <div className={prefix("viewport")} {...{ [DATA_SCENA_ELEMENT_ID]: "viewport" }} ref={this.viewportRef}>
                {this.renderChildren(this.getViewportInfos())}
            </div>
        </div>;
    }
    public componentDidMount() {
        this.ids.viewport.el = this.viewportRef.current!;
    }
    public renderChildren(children: ElementInfo[]): ScenaJSXElement[] {
        return children.map(info => {
            const jsx = info.jsx;
            const nextChildren = info.children!;
            const renderedChildren = this.renderChildren(nextChildren);
            const id = info.id!;
            const props: IObject<any> = {
                key: id,
            };
            if (isString(jsx)) {
                props[DATA_SCENA_ELEMENT_ID] = id;
                return React.createElement(jsx, props, ...renderedChildren) as ScenaJSXElement;
            } else if (isScenaFunction(jsx)) {
                props.scenaElementId = id;
                props.scenaAttrs = info.attrs || {};
                props.scenaText = info.innerText;
                props.scenaHTML = info.innerHTML;

                return React.createElement(jsx, props) as ScenaJSXElement;
            } else if (isString(jsx.type)) {
                props[DATA_SCENA_ELEMENT_ID] = id;
            } else {
                props.scenaElementId = id;
                props.scenaAttrs = info.attrs || {};
                props.scenaText = info.innerText;
                props.scenaHTML = info.innerHTML;
            }
            const jsxChildren = jsx.props.children;
            return React.cloneElement(jsx, { ...jsx.props, ...props },
                ...(isArray(jsxChildren) ? jsxChildren : [jsxChildren]),
                ...this.renderChildren(nextChildren),
            ) as ScenaJSXElement;
        });
    }
    public getJSX(id: string) {
        return this.jsxs[id];
    }
    public getComponent(id: string) {
        return this.components[id];
    }

    public makeId(ids: IObject<any> = this.ids) {

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
            let jsxId = "";


            if (isScenaElement(jsx)) {
                jsxId = this.makeId(this.jsxs);

                this.jsxs[jsxId] = jsx;
                // const component = jsx.type;
                // componentId = component.scenaComponentId;
                // this.components[componentId] = component;
            }
            const elementInfo: ElementInfo = {
                ...info,
                jsx,
                children: this.registerChildren(children, id),
                scopeId,
                componentId,
                jsxId,
                frame: info.frame || {},
                el: null,
                id,
            };
            this.setInfo(id, elementInfo);
            return elementInfo;
        });
    }
    public appendJSXs(jsxs: ElementInfo[], appendIndex: number, scopeId?: string): Promise<AddedInfo> {
        const jsxInfos = this.registerChildren(jsxs, scopeId);

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
        const removedChildren = this.getSortedTargets(targets).map(target => {
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
    public getSortedIndexesList(targets: Array<string | HTMLElement | SVGElement | number[]>) {
        const indexesList = targets.map(target => {
            if (Array.isArray(target)) {
                return target;
            }
            return this.getIndexes(target!)
        });

        indexesList.sort((a, b) => {
            const aLength = a.length;
            const bLength = b.length;
            const length = Math.min(aLength, bLength);

            for (let i = 0; i < length; ++i) {
                if (a[i] === b[i]) {
                    continue;
                }
                return a[i] - b[i];
            }
            return aLength - bLength;
        });

        return indexesList;
    }
    public getSortedTargets(targets: Array<string | HTMLElement | SVGElement>) {
        return this.getSortedInfos(targets).map(info => info.el!);
    }
    public getSortedInfos(targets: Array<string | HTMLElement | SVGElement>) {
        const indexesList = this.getSortedIndexesList(targets);

        return indexesList.map(indexes => this.getInfoByIndexes(indexes));
    }
    public moveInside(target: HTMLElement | SVGElement | string): Promise<MovedResult> {
        const info = isString(target) ? this.getInfo(target)! : this.getInfoByElement(target)!;

        const prevInfo = this.getPrevInfo(info.id!);

        let moved: ElementInfo[];

        if (!prevInfo || isScenaFunction(prevInfo.jsx) || isScenaFunctionElement(prevInfo.jsx)) {
            moved = [];
        } else {
            moved = [info];
        }
        const lastInfo = prevInfo && this.getLastChildInfo(prevInfo.id!);
        return this.move(moved, prevInfo, lastInfo);
    }
    public moveOutside(target: HTMLElement | SVGElement | string): Promise<MovedResult> {
        const info = isString(target) ? this.getInfo(target)! : this.getInfoByElement(target)!;
        const parentInfo = this.getInfo(info.scopeId!);
        const rootInfo = this.getInfo(parentInfo.scopeId!);

        const moved = rootInfo ? [info] : [];

        return this.move(moved, rootInfo, parentInfo);
    }
    public moves(nextInfos: Array<{ info: ElementInfo, parentInfo: ElementInfo, prevInfo?: ElementInfo }>): Promise<MovedResult> {
        const prevInfos = nextInfos.map(({ info }) => {
            return {
                info,
                parentInfo: this.getInfo(info.scopeId!),
                prevInfo: this.getPrevInfo(info.id!),
            };
        });
        nextInfos.forEach(({ info, parentInfo, prevInfo }) => {
            const children = this.getInfo(info.scopeId!).children!;

            children.splice(children.indexOf(info), 1);


            const parnetChildren = parentInfo.children!;
            parnetChildren.splice(prevInfo ? parnetChildren.indexOf(prevInfo) + 1 : 0, 0, info);

            info.scopeId = parentInfo.id;
        });

        const infos = nextInfos.map(({ info }) => info);

        return new Promise(resolve => {
            this.forceUpdate(() => {
                infos.forEach(function moveInfo(info) {
                    const id = info.id!;
                    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`)!;

                    info.el = target;

                    info.children!.forEach(moveInfo);
                });
                resolve({
                    moved: infos,
                    prevInfos,
                    nextInfos,
                });
            })
        });
    }
    public move(infos: ElementInfo[], parentInfo: ElementInfo, prevInfo?: ElementInfo): Promise<MovedResult> {
        const sortedInfos = this.getSortedInfos(infos.map(info => info.el!));

        return this.moves(sortedInfos.map((info, i) => {
            return {
                info,
                parentInfo,
                prevInfo: i === 0 ? prevInfo : sortedInfos[i - 1],
            };
        }));
    }
}
