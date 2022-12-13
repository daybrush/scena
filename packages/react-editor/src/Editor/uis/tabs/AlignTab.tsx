import * as React from "react";
import styled from "react-css-styled";
import { prefix } from "../../utils/utils";

export interface AlignProps {
    type: "horizontal" | "vertical";
    direction: "start" | "center" | "end";
}


const TYPES = ["vertical", "horizontal"] as const;
const DIRECTIONS = ["start", "center", "end"] as const;


function Align(props: AlignProps) {
    const {
        type,
        direction,
    } = props;
    return <div className={prefix("align", `align-${type}`, `align-${direction}`)}>
        <div className={prefix("align-line")}></div>
        <div className={prefix("align-element1")}></div>
        <div className={prefix("align-element2")}></div>
    </div>;
}

const AlignTabElement = styled("div", `
{
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 8px;
}
.scena-align {
    position: relative;
    width: 25px;
    height: 25px;
    display: inline-block;
    margin-right: 5px;
}
.scena-align:hover {
    cursor: pointer;
}
.scena-align:hover * {
    background: white;
}
.scena-align-line,
.scena-align-element1,
.scena-align-element2 {
    position: absolute;
    left: 50%;
    top: 50%;
    background: var(--scena-editor-color-back6);
    transform: translate(-50%, -50%);
}
.scena-align-vertical .scena-align-line {
    width: 1px;
    height: 18px;
}
.scena-align-vertical .scena-align-element1 {
    width: 10px;
    height: 4px;
    margin-top: -3.5px;
}
.scena-align-vertical .scena-align-element2 {
    width: 14px;
    height: 4px;
    margin-top: 3.5px;
}
.scena-align-vertical.scena-align-start .scena-align-line {
    margin-left: -7px;
}
.scena-align-vertical.scena-align-start .scena-align-element1 {
    margin-left: -2px;
}
.scena-align-vertical.scena-align-end .scena-align-line {
    margin-left: 7px;
}
.scena-align-vertical.scena-align-end .scena-align-element1 {
    margin-left: 2px;
}
.scena-align-horizontal .scena-align-line {
    height: 1px;
    width: 18px;
}
.scena-align-horizontal .scena-align-element1 {
    height: 10px;
    width: 4px;
    margin-left: -3.5px;
}
.scena-align-horizontal .scena-align-element2 {
    height: 14px;
    width: 4px;
    margin-left: 3.5px;
}
.scena-align-horizontal.scena-align-start .scena-align-line {
    margin-top: -7px;
}
.scena-align-horizontal.scena-align-start .scena-align-element1 {
    margin-top: -2px;
}
.scena-align-horizontal.scena-align-end .scena-align-line {
    margin-top: 7px;
}
.scena-align-horizontal.scena-align-end .scena-align-element1 {
    margin-top: 2px;
}
`);
export default function AlignTab() {
    return <AlignTabElement className={prefix("align-tab")}>
        {TYPES.map(type => {
            return DIRECTIONS.map(direction => {
                return <Align
                    key={`${type}-${direction}`}
                    type={type}
                    direction={direction} />;
            });
        })}
    </AlignTabElement>;
}
