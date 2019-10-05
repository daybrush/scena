import * as React from "react";
import { prefix } from "../utils";
import styled from "react-css-styler";
import { prefixCSS } from "framework-utils";
import { IObject } from "@daybrush/utils";

const divisions: JSX.Element[] = [];

for (let i = 0; i < 10; ++i) {
    divisions.push(<div className={prefix("ruler-division")} key={i} />);
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

.ruler-division {
    position: relative;
}
.ruler-division:before {
    content: "";
    position: absolute;
    background: #777;
    bottom: 0;
}
.horizontal :host .ruler-division {
    display: inline-block;
    width: 10%;
    height: 100%;
}
.vertical :host .ruler-division {
    display: block;
    width: 100%;
    height: 10%;
}
.horizontal :host .ruler-division:before {
    width: 1px;
    height: 10px;
}
.vertical :host .ruler-division:before {
    width: 10px;
    height: 1px;
    bottom: 0;
    right: 0;
}
.horizontal :host .ruler-division:nth-child(2n):before {
    height: 7px;
}
.vertical :host .ruler-division:nth-child(2n + 1):before {
    width: 7px;
}
.horizontal :host .ruler-division:first-child:before {
    width: 1px;
    height: 100%;
}
.vertical :host .ruler-division:last-child:before {
    height: 1px;
    width: 100%;
}
`));
const RulerUnit = (props: { px: number, style: IObject<any> }) => (
    <RulerUnitElement className={prefix("ruler-unit")} data-px={props.px} style={props.style}>
        {divisions}
    </RulerUnitElement>
);

export default RulerUnit;
