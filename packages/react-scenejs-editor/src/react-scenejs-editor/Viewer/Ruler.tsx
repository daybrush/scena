import * as React from "react";
import { prefix } from "../utils";
import RulerUnit from "./RulerUnit";
import styled from "react-css-styler";
import { prefixCSS, ref } from "framework-utils";
import { getTranslateName, findDOMRef } from "./utils";
import Dragger, { OnDragStart, OnDrag, OnDragEnd } from "@daybrush/drag";

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
:host.horizontal .ruler-divisions {
    white-space: nowrap;
}
`));
function renderUnit(
    unit: number,
    size: number,
    type: "horizontal" | "vertical",
    [min, max]: number[],
) {
    const units: JSX.Element[] = [];

    const translateName = getTranslateName(type, true);

    for (let i = min; i <= max; ++i) {
        units.push(<RulerUnit key={i} px={i * unit} pos={i * size} translateName={translateName} />);
    }
    return units;
}
export default class Ruler extends React.PureComponent<{
    type: "horizontal" | "vertical",
    min: number,
    max: number,
    zoom: number,
    dragStart: (e: OnDragStart) => any,
    drag: (e: OnDrag) => any,
    dragEnd: (e: OnDragEnd) => any,
}> {
    public rulerElement!: HTMLElement;
    public divisionsElement!: HTMLElement;
    private dragger!: Dragger;
    public render() {
        const { type, min, max, zoom } = this.props;
        const isHorizontal = type === "horizontal";
        const scale = zoom < 1
            ? Math.pow(2, Math.round((1 - zoom) * 3))
            : Math.round(1 / Math.round(zoom) * 5) / 5;
        const unit = 50 * scale;
        const range = [
            Math.floor(min / scale),
            Math.ceil(max / scale),
        ];
        const size = zoom * unit;
        return (
            <RulerElement className={prefix("ruler", type)} ref={findDOMRef(this, "rulerElement")}>
                <div className={prefix("ruler-divisions")} ref={ref(this, "divisionsElement")} style={{
                    [isHorizontal ? "width" : "height"]: `${size}px`,
                }}>
                    {renderUnit(unit, size, type, range)}
                </div>
            </RulerElement>
        );
    }
    public componentDidMount() {
        const {
            dragStart,
            drag,
            dragEnd,
        } = this.props;

        this.dragger = new Dragger(
            this.rulerElement, {
            container: document.body,
            dragstart: e => {
                e.datas.fromRuler = true;
                dragStart(e);
            },
            drag,
            dragend: dragEnd,
        },
        );
    }
    public componentWillUnmount() {
        this.dragger.unset();
    }
    public scroll(pos: number) {
        const { type, zoom } = this.props;
        this.divisionsElement.style.transform = `${getTranslateName(type, true)}(${-pos * zoom}px)`;
    }

}
