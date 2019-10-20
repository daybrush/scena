import * as React from "react";
import { ref } from "framework-utils";
import KeyController from "keycon";
import InfiniteScrollViewer from "../InfiniteScrollViewer/InfiniteScrollViewer";
import { RANGE } from "./consts";
import { prefix } from "../utils";

KeyController.setGlobal();

export default class Viewer extends React.PureComponent<{
    zoom: number,
    width?: string,
    height?: string,
    setZoom: (zoom: number) => void,
    onScroll: () => void,
    onResize: () => void,
}> {
    public scrollViewer!: InfiniteScrollViewer;
    public offsetWidth: number = 0;
    public offsetHeight: number = 0;
    public render() {
        const {
            width,
            height,
            zoom,
            onScroll,
            children,
        } = this.props;

        return (<div className={prefix("viewer")}>
            <InfiniteScrollViewer
                ref={ref(this, "scrollViewer")}
                width={width}
                height={height}
                zoom={zoom}
                onScroll={onScroll} range={RANGE} threshold={100}>
                {children}
            </InfiniteScrollViewer>
        </div>);
    }
    public componentDidMount() {
        this.getViewerElement().addEventListener("wheel", this.onWheel);
        window.addEventListener("resize", this.onResize);
    }
    public componentWillUnmount() {
        this.getViewerElement().addEventListener("wheel", this.onWheel);
        window.removeEventListener("resize", this.onResize);
    }
    public scrollTo(scrollLeft: number, scrollTop: number) {
        this.scrollViewer.scrollTo(scrollLeft, scrollTop);
    }
    public getScrollPoses() {
        return this.scrollViewer.getScrollPoses();
    }
    public getViewerElement() {
        return this.scrollViewer.getViewerElement();
    }
    public getContainerElement() {
        return this.scrollViewer.containerElement;
    }
    private onWheel = (e: WheelEvent) => {
        const { deltaY } = e;

        if (!KeyController.global.metaKey || !deltaY) {
            return;
        }
        e.preventDefault();

        const sign = deltaY >= 0 ? 1 : -1;
        const delta = Math.min(Math.abs(deltaY) / 500, 0.03);
        this.props.setZoom(Math.max(this.props.zoom * (1 + sign * delta), 0.2));
    }
    public onResize = () => {
        const viewerElement = this.getViewerElement();

        this.offsetWidth = viewerElement.offsetWidth;
        this.offsetHeight = viewerElement.offsetHeight;

        this.props.onResize();
    }
}
