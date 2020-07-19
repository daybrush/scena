import * as React from "react";
import { IObject, find, findIndex } from "@daybrush/utils";
import { prefix, getId } from "../utils/utils";
import { isNumber } from "util";
import { DATA_SCENA_ELEMENT, DATA_SCENA_ELEMENT_ID } from "../consts";

export interface ElementInfo extends JSXInfo {
    jsx: any;
    el: HTMLElement | null;
    id: string;
    frame: IObject<any>;
}

export interface AddedInfo {
    added: ElementInfo[];
    next: ElementInfo[];
}
export interface RemovedInfo {
    removed: ElementInfo[];
    next: ElementInfo[];
}
export interface JSXInfo {
    jsx: any;
    name: string;
    frame?: IObject<any>;
    id?: string;
    index?: number;
    isContentEditable?: boolean;
    innerText?: string;
}
export default class Viewport extends React.PureComponent<{
    style: IObject<any>,
}> {
    public state: {
        ids: IObject<ElementInfo | null>;
        infos: ElementInfo[],
    } = {
            ids: {},
            infos: [],
        };
    public render() {
        const style = this.props.style;
        return <div className={prefix("viewport")} style={style}>
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
    public appendJSXs(jsxs: JSXInfo[]): Promise<AddedInfo> {
        const infos = this.state.infos;
        const jsxInfos = jsxs.map(info => {
            const id = info.id || this.makeId();
            const elementInfo: ElementInfo = {
                ...info,
                jsx: React.cloneElement(info.jsx, {
                    [DATA_SCENA_ELEMENT]: true,
                    [DATA_SCENA_ELEMENT_ID]: id,
                    "key": id,
                }),
                frame: info.frame || {},
                el: null,
                id,
            };
            this.setInfo(id, elementInfo);

            return elementInfo;
        });
        const nextInfos = [...infos];

        jsxInfos.forEach(info => {
            if (isNumber(info.index)) {
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
                const infos = jsxInfos.map((info, i) => {
                    const id = info.id;

                    const target = document.querySelector<HTMLElement>(`[data-scena-element-id="${id}"]`)!;
                    info.el = target;

                    target.setAttribute(DATA_SCENA_ELEMENT, "true");
                    target.setAttribute(DATA_SCENA_ELEMENT_ID, id);

                    info.isContentEditable = info.isContentEditable || !!target.getAttribute("contenteditable");

                    if (info.isContentEditable) {
                        target.setAttribute("contenteditable", "true");

                        if ("innerText" in info) {
                            (target as HTMLElement).innerText = info.innerText || "";
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
            if (info.isContentEditable) {
                innerText = (target as HTMLElement).innerText;
            }
            delete ids[info.id];
            delete info.el;

            infos.splice(infos.indexOf(info), 1);

            return { ...info, innerText };
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
