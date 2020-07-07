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
    public appendJSXs(jsxs: Array<{ jsx: any, name: string, frame: IObject<any> }>): Promise<Array<HTMLElement | SVGElement>> {
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

                const targets = jsxInfos.map((info, i) => {
                    const id = info.id;
                    const frame = jsxs[i].frame || {};

                    const target = document.querySelector<HTMLElement>(`[data-moveable-id="${id}"]`)!;
                    MoveableData.createFrame(target, frame);
                    MoveableData.render(target);
                    info.el = target;

                    return target;
                });
                Memory.set("viewportInfos", nextInfos);
                EventBus.requestTrigger("changeLayers", {
                    infos: nextInfos,
                });
                resolve(targets);
            });
        });
    }
    public appendJSX(jsx: any, name: string, frame: IObject<any> = {}): Promise<HTMLElement | SVGElement> {
        return this.appendJSXs([{
            jsx,
            name,
            frame,
        }]).then(targets => targets[0]);
    }
    public appendElement(Tag: any, props: IObject<any>, name: string, frame: IObject<any> = {}): Promise<HTMLElement | SVGElement> {
        return this.appendJSX(<Tag {...props}></Tag>, name, frame);
    }
    public appendElements(elements: Array<{ tag: any, props: IObject<any>, name: string, frame: IObject<any> }>): Promise<Array<HTMLElement | SVGElement>> {
        return this.appendJSXs(elements.map(({ props, name, frame, tag: Tag }) => ({
            jsx: <Tag {...props}></Tag>,
            name,
            frame,
        })));
    }
}
