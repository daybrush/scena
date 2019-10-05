import * as React from "react";
import { prefix } from "../utils";
import styled from "react-css-styler";
import { prefixCSS } from "framework-utils";
import { IObject } from "@daybrush/utils";
import RulerDivisionElement from "./RulerDivision";

const divisions: JSX.Element[] = [];

for (let i = 0; i < 10; ++i) {
    divisions.push(<RulerDivisionElement className={prefix("ruler-division")} key={i} />);
}
const RulerUnitElement = styled("div", prefixCSS("scenejs-editor-", `
{
    position:relative;
}
.horizontal :host {
    display: inline-block;
    width: 50px;
    height: 30px;
}
.vertical :host {
    width: 30px;
    height: 50px;
}
:host:before {
    position: absolute;
    content: attr(data-px);
    color: #fff;
    font-size: 10px;
}
.horizontal :host:before {
    top: 2px;
    left: 4px;
}
.vertical :host:before {
    transform-origin: 0px 0px;
    top: calc(100% - 4px);
    left: 2px;
    transform: rotate(-90deg);
}
`));
const RulerUnit = (props: { px: number, style: IObject<any> }) => (
    <RulerUnitElement className={prefix("ruler-unit")} data-px={props.px} style={props.style}>
        {divisions}
    </RulerUnitElement>
);

export default RulerUnit;
