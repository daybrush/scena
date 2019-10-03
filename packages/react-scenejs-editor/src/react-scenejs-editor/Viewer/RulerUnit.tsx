import * as React from "react";
import { prefix } from "../utils";
import styled from "react-css-styler";
import { prefixCSS } from "framework-utils";

const divisions: JSX.Element[] = [];

for (let i = 0; i < 10; ++i) {
    divisions.push(<div className={prefix("ruler-division")} key={i}></div>);
}
const RulerUnitElement = styled("div", prefixCSS("scenejs-editor-", `
{
    position:relative;
}
:host:before {
    position: absolute;
    content: attr(data-px);
    color: #fff;
    font-size: 10px;
}
.ruler-division {
    position: relative;
    background: #777;
}
.horizontal :host {
    display: inline-block;
}
.horizontal :host:before {
    bottom: 15px;
    left: 5px;
}
.horizontal :host .ruler-division {
    display: inline-block;
    width: 1px;
    height: 10px;
    margin-right: 4px;
}
.horizontal :host .ruler-division:nth-child(2n) {
    height: 7px;
}
.horizontal :host .ruler-division:first-child {
    height: 30px;
}
.vertical :host {
    clear: both;
    height: 50px;
    padding-top: 4px;
    box-sizing: border-box;
}
.vertical :host:before {
    transform-origin: 0% 0%;
    bottom: 0px;
    left: 4px;
    transform: rotate(-90deg) ;
}
.vertical :host .ruler-division {
    display: block;
    width: 10px;
    height: 1px;
    margin-top: 4px;
    float: right;
    clear: both;
}
.vertical :host .ruler-division:first-child {
    margin-top: 0px;
}
.vertical :host .ruler-division:nth-child(2n) {
    width: 7px;
}

.vertical :host .ruler-division:nth-child(10n) {
    width: 30px;
}
`));
const RulerUnit = (props: { px: number }) => (
    <RulerUnitElement className={prefix("ruler-unit")} data-px={props.px}>{divisions}</RulerUnitElement>
);

export default RulerUnit;
