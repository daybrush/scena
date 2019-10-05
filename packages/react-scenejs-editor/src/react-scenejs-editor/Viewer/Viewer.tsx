import * as React from "react";
import { prefix } from "../utils";
import { ref } from "framework-utils";
import Dragger from "@daybrush/drag";
import KeyController from "keycon";

KeyController.setGlobal();

export default class Viewer extends React.PureComponent<{
    horizontalMin: number,
    horizontalMax: number,
    verticalMin: number,
    verticalMax: number,
    zoom: number,
    width?: string,
    height?: string,
    setZoom: (zoom: number) => void,
    onScroll: () => void,
}> {
    public static defaultProps = {
        width: "100%",
        height: "100%",
    };
    public viewerElement!: HTMLElement;
    public width: number = 0;
    public height: number = 0;
    public dragger!: Dragger;
    public render() {
        const {
            horizontalMin,
            horizontalMax,
            verticalMin,
            verticalMax,
            onScroll,
            width,
            height,
            zoom,
        } = this.props;
        const scale = 50 * zoom;
        const scrollWidth = `${(horizontalMax - horizontalMin) * scale}px`;
        const scrollHeight = `${(verticalMax - verticalMin) * scale}px`;
        const transform = `translate(${-horizontalMin * scale}px, ${-verticalMin * scale}px) scale(${zoom})`;

        return (
            <div className={prefix("viewer")}
                ref={ref(this, "viewerElement")}
                onScroll={onScroll}>
                <div className={prefix("scroller")} ref={ref(this, "scrollerElement")} style={{
                    width: scrollWidth,
                    height: scrollHeight,
                }}></div>
                <div className={prefix("container")} ref={ref(this, "containerElement")} style={{
                    width,
                    height,
                    transform,
                }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
    public componentDidMount() {
        // for touch device
        // scrollTop, scrollLeft are not directly reflected.
        this.dragger = new Dragger(this.viewerElement, {
            container: document.body,
            events: ["touch"],
            dragstart: ({ inputEvent }) => {
                inputEvent.preventDefault();
            },
            drag: e => {
                this.scrollBy(-e.deltaX, -e.deltaY);
            },
        });
        this.viewerElement.addEventListener("wheel", this.onWheel);
        window.addEventListener("resize", this.onResize);
    }
    public componentWillUnmount() {
        this.dragger.unset();
        this.viewerElement.removeEventListener("wheel", this.onWheel);
        window.removeEventListener("resize", this.onResize);
    }
    public getScrollPos() {
        const viewerElement = this.viewerElement;

        return [
            viewerElement.scrollLeft,
            viewerElement.scrollTop,
        ];
    }
    public scrollBy(scrollLeft: number, scrollTop: number) {
        const viewerElement = this.viewerElement;

        viewerElement.scrollLeft += scrollLeft;
        viewerElement.scrollTop += scrollTop;
    }
    public scroll(scrollLeft: number, scrollTop: number) {
        const viewerElement = this.viewerElement;

        viewerElement.scrollLeft = scrollLeft;
        viewerElement.scrollTop = scrollTop;
    }
    public restoreScroll() {
        const { horizontalMin, verticalMin, zoom } = this.props;
        this.scroll(-horizontalMin * 50 * zoom, -verticalMin * 50 * zoom);
    }
    public onResize = () => {
        const rect = this.viewerElement.getBoundingClientRect();

        this.width = rect.width;
        this.height = rect.height;

        this.props.onScroll();
    }
    private onWheel = (e: WheelEvent) => {
        const { deltaY } = e;

        if (!KeyController.global.metaKey || !deltaY) {
            return;
        }
        e.preventDefault();

        const sign = deltaY >= 0 ? 1 : -1;
        const delta = Math.min(Math.abs(deltaY) / 1000, 0.01);
        this.props.setZoom(Math.max(this.props.zoom * (1 + sign * delta), 0.2));
    }
}
