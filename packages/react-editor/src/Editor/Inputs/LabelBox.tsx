import * as React from "react";
import { prefix } from "../utils/utils";

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
            <h3>{label}</h3>
        </div>;
    }
}
