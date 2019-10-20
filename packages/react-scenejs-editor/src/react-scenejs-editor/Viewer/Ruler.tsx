import * as React from "react";
import { prefix } from "../utils";
import styled, { StylerInterface } from "react-css-styler";
import { prefixCSS, ref } from "framework-utils";
import Dragger, { OnDragStart, OnDrag, OnDragEnd } from "@daybrush/drag";

const RulerElement = styled("div", prefixCSS("scenejs-editor-", `
{
    position: absolute;
    background: #444;
    overflow: hidden;
    z-index: 10;
}
:host.horizontal {
    width: calc(100% - 30px);
    height: 30px;
    left: 30px;
    top: 0px;
}
:host.vertical {
    top: 30px;
    left: 0px;
    width: 30px;
    height: calc(100% - 30px);
}
canvas {
    width: 100%;
    height: 100%;
}
`));

export default class Ruler extends React.PureComponent<{
    type: "horizontal" | "vertical",
    width: number,
    height: number,
    unit: number,
    zoom?: number,
    onDragStart: (e: OnDragStart) => any,
    onDrag: (e: OnDrag) => any,
    onDragEnd: (e: OnDragEnd) => any,
}> {
    public static defaultProps = {
        zoom: 1,
    }
    public state = {
        scrollPos: 0,
    };
    private canvasElement!: HTMLCanvasElement;
    private canvasContext!: CanvasRenderingContext2D;
    public ruler!: StylerInterface<HTMLElement>;
    public divisionsElement!: HTMLElement;
    private dragger!: Dragger;
    public render() {
        const { type } = this.props;

        return <RulerElement className={prefix("ruler", type)} ref={ref(this, "ruler")}><canvas ref={ref(this, "canvasElement")} /></RulerElement>;
    }
    public componentDidMount() {
        const canvas = this.canvasElement;
        const context = canvas.getContext("2d");

        this.canvasContext = context;

        this.resize();
        this.draw();

        const {
            onDragStart,
            onDrag,
            onDragEnd,
        } = this.props;
        console.log(this.ruler.getElement());
        this.dragger = new Dragger(
            this.ruler.getElement(), {
            container: document.body,
            dragstart: e => {
                e.datas.fromRuler = true;
                onDragStart(e);
            },
            drag: onDrag,
            dragend: onDragEnd,
        },
        );
    }
    public componentDidUpdate() {
        this.resize();
        this.draw();
    }
    public componentWillUnmount() {
        this.dragger.unset();
    }
    public scroll(scrollPos: number) {
        this.draw(scrollPos);
    }
    private resize() {
        const canvas = this.canvasElement;
        const {
            width,
            height,
        } = this.props;

        canvas.width = width * 2;
        canvas.height = height * 2;
    }
    private draw(scrollPos = this.state.scrollPos) {
        const {
            width,
            height,
            unit,
            zoom,
            type,
        } = this.props;
        this.state.scrollPos = scrollPos;
        const context = this.canvasContext;
        const isHorizontal = type === "horizontal";

        context.clearRect(0, 0, width * 2, height * 2);
        context.save();
        context.scale(2, 2);
        context.strokeStyle = "#777777";
        context.lineWidth = 1;
        context.font = "10px sans-serif";
        context.fillStyle = "#ffffff";
        context.translate(0.5, 0);
        context.beginPath();

        const size = isHorizontal ? width : height;
        const zoomUnit = zoom * unit;
        const minRange = Math.floor(scrollPos * zoom / zoomUnit);
        const maxRange = Math.ceil((scrollPos * zoom + size) / zoomUnit);
        const length = maxRange - minRange;

        for (let i = 0; i < length; ++i) {
            const startPos = ((i + minRange) * unit - scrollPos) * zoom;

            if (startPos >= -zoomUnit && startPos < size) {
                const startX = isHorizontal ? startPos + 3 : 12;
                const startY = isHorizontal ? 12 : startPos - 3;

                if (isHorizontal) {
                    context.fillText(`${(i + minRange) * unit}`, startX, startY);
                } else {
                    context.save();
                    context.translate(startX, startY);
                    context.rotate(-Math.PI / 2);
                    context.fillText(`${(i + minRange) * unit}`, 0, 0);
                    context.restore();
                }
            }

            for (let j = 0; j < 10; ++j) {
                const pos = startPos + j / 10 * zoomUnit;

                if (pos < 0 || pos >= size) {
                    continue;
                }
                const lineSize = j === 0
                    ? 30
                    : (j % 2 === 0 ? 10 : 7);

                const x1 = isHorizontal ? pos : 30 - lineSize;
                const x2 = isHorizontal ? pos : 30;
                const y1 = isHorizontal ? 30 - lineSize : pos;
                const y2 = isHorizontal ? 30 : pos;
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
            }
        }
        context.stroke();
        context.restore();
    }
}
