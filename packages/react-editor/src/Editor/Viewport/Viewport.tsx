import * as React from "react";
import { IObject } from "@daybrush/utils";
import MoveableData from "../utils/MoveableData";
import EventBus from "../utils/EventBus";
import Memory from "../utils/Memory";
import { prefix } from "../utils/utils";

export interface ElementInfo {
    jsx: any;
    el: HTMLElement | null;
    id: string;
    name: string;
}
export default class Viewport extends React.PureComponent {
    public state: {
        ids: IObject<ElementInfo | null>;
        infos: ElementInfo[],
    } = {
            ids: {},
            infos: [],
        };
    public render() {
        return <div className={prefix("viewport")}>
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
    public appendJSX(jsx: any, name: string, frame: IObject<any> = {}): Promise<HTMLElement | SVGElement> {
        const infos = this.state.infos;
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
        const nextInfos = [...infos, info];

        return new Promise(resolve => {
            this.setState({
                infos: nextInfos,
            }, () => {
                const target = document.querySelector<HTMLElement>(`[data-moveable-id="${id}"]`)!;
                MoveableData.createFrame(target, frame);
                MoveableData.render(target);
                info.el = target;

                Memory.set("viewportInfos", nextInfos);
                EventBus.requestTrigger("changeLayers", {
                    infos: nextInfos,
                });
                resolve(target);
            });
        });
    }
    public appendElement(Tag: any, props: IObject<any>, name: string, frame: IObject<any> = {}): Promise<HTMLElement | SVGElement> {
        return this.appendJSX(<Tag {...props}></Tag>, name, frame);
    }
}
