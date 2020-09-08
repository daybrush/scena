import * as React from "react";
import { prefix } from "../utils/utils";
import styled from "react-css-styled";

const LabelElement = styled("div", `
{
    position: relative;
    box-sizing: border-box;
    padding: 2px;
    display: inline-block;
    vertical-align: top;
}
h3 {
    color: white;
    margin: 0;
    padding: 7px 5px;
    font-size: 12px;
    font-weight: bold;
    display: inline-block;
}
:host.scena-full {
    width: 100%;
}
:host.scena-half {
    width: 50%;
}
:host.scena-third {
    width: 33%;
}
:host.scena-twothird {
    width: 66%;
}
:host.scena-half:nth-child(2n + 1) {
    padding-right: 5px;
}
:host.scena-half:nth-child(2n + 2) {
    padding-left: 5px;
}
`);
export default class LabelBox extends React.PureComponent<{
    type: "half" | "full" | "third" | "twothird" | "",
    label: string,
}> {
    public render() {
        const {
            label,
            type,
        } = this.props;

        return <LabelElement className={prefix("label", type)}>
            <h3>{label}</h3>
        </LabelElement>;
    }
}
