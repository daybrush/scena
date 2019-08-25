import * as React from "react";
import { prefix } from "../../utils";

export default class LabelBox extends React.PureComponent<{
    value: string,
}> {
    public render() {
        return (<div className={prefix("label")}>{this.props.value}</div>);
    }
}
