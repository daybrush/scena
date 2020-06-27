import * as React from "react";
import { prefix } from "../../utils";

export default class LabelBox extends React.PureComponent<{
    type: "half" | "full" | "third",
    label: string,
}> {
    public render() {
        const {
            label,
            type,
        } = this.props;

        return <div className={prefix("tab-input", type)}>
            <h4>{label}</h4>
        </div>;
    }
}
