import * as React from "react";
import { IObject } from "@daybrush/utils";
import MoveableData from "../MoveableData";

export default class Viewport extends React.PureComponent {
    public state: {
        ids: IObject<boolean>;
        elements: any[],
    } = {
            ids: {},
            elements: [],
        };
    public render() {
        return <div className="viewport">
            {this.props.children}
            {this.state.elements}
        </div>;
    }
    public makeId() {
        const ids = this.state.ids;

        while (true) {
            const id = `scena${Math.floor(Math.random() * 100000000)}`;

            if (ids[id]) {
                continue;
            }
            ids[id] = true;

            return id;
        }
    }
    public appendElement(Tag: any, props: IObject<any>, frame: IObject<any> = {}): Promise<HTMLElement | SVGElement> {
        const elements = this.state.elements;
        const id = this.makeId();

        elements.push(<Tag {...props} data-moveable data-moveable-id={id} key={id}></Tag>);

        return new Promise(resolve => {
            this.setState({
                elements: [...elements],
            }, () => {
                const target = document.querySelector<HTMLElement>(`[data-moveable-id="${id}"]`)!;
                MoveableData.createFrame(target, frame);
                MoveableData.render(target);

                resolve(target);
            });
        });
    }

}
