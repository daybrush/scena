import * as React from "react";
import { IObject, find, findIndex } from "@daybrush/utils";
import { prefix, getId, getScenaAttrs } from "../utils/utils";
import { isNumber } from "util";
import { DATA_SCENA_ELEMENT_ID } from "../consts";
import { ScenaJSXElement, ScenaComponent } from "../types";

export interface AddedInfo {
    added: ElementInfo[];
    next: ElementInfo[];
}
export interface RemovedInfo {
    removed: ElementInfo[];
    next: ElementInfo[];
}
export interface ElementInfo {
    jsx: ScenaJSXElement;
    name: string;
    frame?: IObject<any>;

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
    public state: {
        ids: IObject<ElementInfo | null>;
        infos: ElementInfo[],
    } = {
            ids: {},
            infos: [],
        };
    public getJSX(id: string) {
        return this.jsxs[id];
    }
    public getComponent(id: string) {
        return this.components[id];
    }
    public render() {
        const style = this.props.style;
        return <div className={prefix("viewport")} onBlur={this.props.onBlur} style={style}>
            {this.props.children}
            {this.state.infos.map(info => info.jsx)}
        </div>;
    }
    public makeId() {
        const ids = this.state.ids;

        while (true) {
            const id = `scena${Math.floor(Math.random() * 100000000)}`;

            if (ids[id]) {
                continue;
            }
            return id;
        }
    }
    public setInfo(id: string, info: ElementInfo) {
        const ids = this.state.ids;

        ids[id] = info;
    }
    public getInfo(id: string) {
        return this.state.ids[id];
    }
    public getInfoByElement(el: HTMLElement | SVGElement) {
        return this.state.ids[getId(el)];
    }
    public getElement(id: string) {
        const info = this.getInfo(id);

        return info ? info.el : null;
    }
    public getInfos() {
        return this.state.infos;
    }
    public appendJSXs(jsxs: ElementInfo[], appendIndex: number): Promise<AddedInfo> {
        const infos = this.state.infos;
        const jsxInfos = jsxs.map(info => {
            const id = info.id || this.makeId();
            const jsx = info.jsx;
            let componentId = "";

            const props: IObject<any> = {
                "key": id,
            };
            if (typeof jsx.type === "string") {
                props[DATA_SCENA_ELEMENT_ID] = id;
            } else {
                const component = jsx.type;
                componentId = component.scenaComponentId;

                this.components[componentId] = component;


                props.scenaElementId = id;
                props.scenaAttrs = info.attrs || {};
                props.scenaText = info.innerText;
                props.scenaHTML = info.innerHTML;
            }
            const elementInfo: ElementInfo = {
                ...info,
                jsx: React.cloneElement(info.jsx, props) as ScenaJSXElement,
                componentId,
                frame: info.frame || {},
                el: null,
                id,
            };
            this.setInfo(id, elementInfo);

            return elementInfo;
        });
        const nextInfos = [...infos];

        jsxInfos.forEach((info, i) => {
            if (appendIndex > -1) {
                nextInfos.splice(appendIndex + i, 0, info);
                info.index = appendIndex + i;
            } else if (isNumber(info.index)) {
                nextInfos.splice(info.index, 0, info);
            } else {
                info.index = nextInfos.length;
                nextInfos.push(info);
            }
        });

        return new Promise(resolve => {
            this.setState({
                infos: nextInfos,
            }, () => {
                const infos = jsxInfos.map(info => {
                    const id = info.id!;

                    const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`)!;
                    const attrs = info.attrs;

                    info.el = target;

                    if (attrs) {
                        for (const name in attrs) {
                            target.setAttribute(name, attrs[name]);
                        }
                    }
                    info.attrs = getScenaAttrs(target);

                    if (info.attrs!.contenteditable) {
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
                    next: nextInfos,
                });
            });
        });
    }
    public findIndex(id: string) {
        return findIndex(this.state.infos, info => info.id === id);
    }
    public getElements(ids: string[]) {
        return ids.map(id => this.getElement(id)).filter(el => el) as Array<HTMLElement | SVGElement>;
    }
    public removeTargets(targets: Array<HTMLElement | SVGElement>): Promise<RemovedInfo> {
        const { ids, infos } = this.state;

        const removed = targets.map(target => {
            const info = find(infos, ({ el }) => el === target);

            if (!info) {
                return undefined;
            }
            let innerText = "";
            let innerHTML = "";
            if (info.attrs!.contenteditable) {
                innerText = (target as HTMLElement).innerText;
            } else {
                innerHTML = target.innerHTML;
            }
            delete ids[info.id!];
            delete info.el;

            infos.splice(infos.indexOf(info), 1);

            return { ...info, innerText, innerHTML, attrs: getScenaAttrs(target) };
        }).filter(info => info) as ElementInfo[];

        return new Promise(resolve => {
            this.setState({
                ids: { ...ids },
                infos: [...infos],
            }, () => {
                resolve({
                    removed,
                    next: infos,
                });
            })
        });
    }
}
