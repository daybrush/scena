import * as React from "react";
import { IObject, find, findIndex } from "@daybrush/utils";
import { prefix } from "../utils/utils";
import { isNumber } from "util";

export interface ElementInfo {
    jsx: any;
    el: HTMLElement | null;
    id: string;
    name: string;
    frame: IObject<any>;
    addedIndex?: number;
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
    public getElement(id: string) {
        const info = this.getInfo(id);

        return info ? info.el : null;
    }
    public getInfos() {
        return this.state.infos;
    }
    public appendJSXs(jsxs: JSXInfo[]): Promise<AddedInfo> {
        const infos = this.state.infos;
        const jsxInfos = jsxs.map(({ jsx, name, id: prevId, frame, index }) => {
            const id = prevId || this.makeId();
            const info: ElementInfo = {
                jsx: React.cloneElement(jsx, {
                    "data-scena-element": true,
                    "data-scena-element-id": id,
                    "key": id,
                }),
                frame: frame || {},
                el: null,
                id,
                name,
                addedIndex: index,
            };
            this.setInfo(id, info);

            return info;
        });
        const nextInfos = [...infos];

        jsxInfos.forEach(info => {
            if (isNumber(info.addedIndex)) {
                nextInfos.splice(info.addedIndex, 0, info);
            } else {
                info.addedIndex = nextInfos.length;
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

            delete ids[info.id];
            delete info.el;

            infos.splice(infos.indexOf(info), 1);

            return { ...info };
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
