import * as React from "react";
import { prefix } from "../react-scenejs-editor/utils";

export default class Moveable extends React.PureComponent<{
    target: HTMLElement,
}> {
    public render() {
        const { target } = this.props;
        const { left, top, width, height } = target.getBoundingClientRect();


        return (
            <div className={prefix("control-box")}>
                <div className={prefix("control", "nw")}></div>
                <div className={prefix("control", "n")}></div>
                <div className={prefix("control", "ne")}></div>

                <div className={prefix("control", "w")}></div>
                <div className={prefix("control", "e")}></div>

                <div className={prefix("control", "sw")}></div>
                <div className={prefix("control", "s")}></div>
                <div className={prefix("control", "se")}></div>
            </div>
        );
    }
}
