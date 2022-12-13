import * as React from "react";
import styled from "react-css-styled";
import { prefix } from "../../../utils/utils";

const AnchorElement = styled("div", `
{
    position: relative;
    width: 38px;
    height: 38px;
    box-sizing: border-box;
    padding: 4px;
}
.scena-anchor-input-background {
    position: relative;
    width: 30px;
    height: 30px;
    background: var(--scena-editor-color-back1);
}
.scena-anchor-control {
    position: absolute;
    width: 8px;
    height: 8px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    padding: 1px;
    box-sizing: border-box;
}
.scena-anchor-control:before {
    content: "";
    position: relative;
    display: block;
    background: var(--scena-editor-color-back5);
    width: 100%;
    height: 100%;
}
.scena-anchor-control.scena-anchor-selected {
    padding: 0px;
}
.scena-anchor-control.scena-anchor-selected:before {
    background: white;
}
.scena-anchor-control.scena-anchor-n {
    top: 0;
}
.scena-anchor-control.scena-anchor-s {
    top: 100%;
}
.scena-anchor-control.scena-anchor-w {
    left: 0;
}
.scena-anchor-control.scena-anchor-e {
    left: 100%;
}
`);



const HORIZONTAL_DIRECTIONS = ["w", "", "e"];
const VERTICAL_DIRECTIONS = ["n", "", "s"];

export default function Anchor() {
    const [origin] = React.useState([50, 50]);
    const originValue = origin.map(v => Math.min(100, Math.max(0, Math.round(v / 50) * 50)));
    return (
        <AnchorElement className={prefix("anchor-input")}>
            <div className={prefix("anchor-input-background")}>
                {VERTICAL_DIRECTIONS.map((v, i) => {
                    return HORIZONTAL_DIRECTIONS.map((h, j) => {
                        const classNames: string[] = [];
                        if (v) {
                            classNames.push(`anchor-${v}`);
                        }
                        if (h) {
                            classNames.push(`anchor-${h}`);
                        }
                        if (originValue[0] === j * 50 && originValue[1] === i * 50) {
                            classNames.push(`anchor-selected`);
                        }
                        return <div key={`dir${h}-${v}`}
                            className={prefix("anchor-control", ...classNames)} data-anchor-index={`${j},${i}`}></div>;
                    });
                })}
            </div>
        </AnchorElement>
    );
}

