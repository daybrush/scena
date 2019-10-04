import * as React from "react";
import { prefix } from "../utils";
import RulerUnit from "./RulerUnit";
import styled from "react-css-styler";
import { prefixCSS, ref } from "framework-utils";
import { getTranslateName } from "./utils";

const RulerElement = styled("div", prefixCSS("scenejs-editor-", `
{
    position: absolute;
    background: #444;
    overflow: hidden;
}
:host.horizontal {
    width: calc(100% - 30px);
    height: 30px;
    left: 30px;
    top: 0px;
    white-space:nowrap;
}
:host.vertical {
    top: 30px;
    left: 0px;
    width: 30px;
    height: calc(100% - 30px);
}
.ruler-divisions {
    position:relative;
    font-size: 0;
    pointer-events: none;
    will-change: transform;
}
:host.vertical .ruler-divisions {
    right: 0;
}
.ruler-minus-divisions, .ruler-plus-divisions {
    position: absolute;
}
:host.horizontal .ruler-divisions {
    white-space: nowrap;
}
:host.horizontal .ruler-minus-divisions {
    right: 100%;
}
:host.horizontal .ruler-plus-divisions {
    left: 0;
}
:host.vertical .ruler-minus-divisions {
    bottom: 100%;
}
:host.vertical .ruler-plus-divisions {
    top: 0;
}
`));
function renderUnit([min, max]: number[]) {
    const units: JSX.Element[] = [];

    for (let i = min; i <= max; ++i) {
        units.push(<RulerUnit key={i * 50} px={i * 50} />);
    }
    return units;
}
export default class Ruler extends React.PureComponent<{
    type: "horizontal" | "vertical",
    min: number,
    max: number,
}> {
    public divisionsElement!: HTMLElement;
    public render() {
        const { type, min, max } = this.props;
        const isHorizontal = type === "horizontal";
        const plusRange = isHorizontal ? [0, max - 1] : [1, max];
        const minusRange = isHorizontal ? [min, -1] : [min + 1, 0];
        return (
            <RulerElement className={prefix("ruler", type)}>
                <div className={prefix("ruler-divisions")} ref={ref(this, "divisionsElement")}>
                    <div className={prefix("ruler-minus-divisions")}>{renderUnit(minusRange)}</div>
                    <div className={prefix("ruler-plus-divisions")}>{renderUnit(plusRange)}</div>
                </div>
            </RulerElement>
        );
    }
    public scroll(pos: number) {
        this.divisionsElement.style.transform = `${getTranslateName(this.props.type, true)}(${-pos}px)`;
    }
}
