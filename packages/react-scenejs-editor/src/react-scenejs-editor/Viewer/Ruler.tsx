import * as React from "react";
import { prefix } from "../utils";
import RulerUnit from "./RulerUnit";
import styled from "react-css-styler";
import { prefixCSS, ref } from "framework-utils";
import { getTranslateName, findDOMRef } from "./utils";
import Dragger, { OnDragStart, OnDrag, OnDragEnd } from "@daybrush/drag";
import { IObject } from "@daybrush/utils";

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
    bottom: calc(100% - 1px);
}
:host.vertical .ruler-plus-divisions {
    top: 1px;
}
`));
function renderUnit([min, max]: number[], style: IObject<any>) {
    const units: JSX.Element[] = [];

    for (let i = min; i <= max; ++i) {
        units.push(<RulerUnit key={i * 50} px={i * 50} style={style} />);
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
        const plusRange = isHorizontal ? [0, max - 1] : [1, max];
        const minusRange = isHorizontal ? [min, -1] : [min + 1, 0];
        const style = {
            [isHorizontal ? "width" : "height"]: `${zoom * 50}px`,
        };
        return (
            <RulerElement className={prefix("ruler", type)} ref={findDOMRef(this, "rulerElement")}>
                <div className={prefix("ruler-divisions")} ref={ref(this, "divisionsElement")}>
                    <div className={prefix("ruler-minus-divisions")}>{renderUnit(minusRange, style)}</div>
                    <div className={prefix("ruler-plus-divisions")}>{renderUnit(plusRange, style)}</div>
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
