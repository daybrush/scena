import * as React from "react";
import { IObject, find } from "@daybrush/utils";
import { prefix } from "../utils/utils";

export interface ElementInfo {
    jsx: any;
    el: HTMLElement | null;
    id: string;
    name: string;
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
    public appendJSXs(jsxs: JSXInfo[]): Promise<AddedInfo> {
        const infos = this.state.infos;
        const jsxInfos = jsxs.map(({ jsx, name }) => {
            const id = this.makeId();
            const info: ElementInfo = {
                jsx: React.cloneElement(jsx, {
                    "data-moveable": true,
                    "data-moveable-id": id,
                    "key": id,
                }),
                el: null,
                id,
                name,
            };
            this.setInfo(id, info);

            return info;
        });
        const nextInfos = [...infos, ...jsxInfos];


        return new Promise(resolve => {
            this.setState({
                infos: nextInfos,
            }, () => {
                const infos = jsxInfos.map((info, i) => {
                    const id = info.id;

                    const target = document.querySelector<HTMLElement>(`[data-moveable-id="${id}"]`)!;
                    info.el = target;

                    return info;
                });

                resolve({
                    added: infos,
                    next: nextInfos,
                });
            });
        });
    }
    public removeTargets(targets: Array<HTMLElement | SVGElement>): Promise<RemovedInfo> {
        const { ids, infos } = this.state;

        const removed = targets.map(target => {
            const info = find(infos, ({ el }) => el === target);

            if (!info) {
                return undefined;
            }

            delete ids[info.id];
            return infos.splice(infos.indexOf(info), 1)[0];
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
