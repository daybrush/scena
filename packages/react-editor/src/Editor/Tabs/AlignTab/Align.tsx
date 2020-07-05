import * as React from "react";
import { prefix } from "../../utils/utils";

export default class Align extends React.PureComponent<{
    type: "horizontal" | "vertical",
    direction: "start" | "center" | "end",
    onClick: (type: "horizontal" | "vertical", direction: "start" | "center" | "end") => any,
}> {
    public render() {
        const {
            type,
            direction,
        } = this.props;
        return <div className={prefix("align", `align-${type}`, `align-${direction}`)}
            onClick={this.onClick}>
            <div className={prefix("align-line")}></div>
            <div className={prefix("align-element1")}></div>
            <div className={prefix("align-element2")}></div>
        </div>;
    }
    public onClick = () => {
        const {
            type,
            direction,
            onClick,
        } = this.props;
        onClick(type, direction);
    }
}
