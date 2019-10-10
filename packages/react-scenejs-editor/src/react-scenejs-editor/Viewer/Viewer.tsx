import * as React from "react";
import { ref } from "framework-utils";
import KeyController from "keycon";
import InfiniteScrollViewer from "./InfiniteScrollViewer";
import { RANGE } from "./consts";
import { prefix } from "../utils";

KeyController.setGlobal();

export default class Viewer extends React.PureComponent<{
    zoom: number,
    width?: string,
    height?: string,
    setZoom: (zoom: number) => void,
    onScroll: () => void,
}> {
    public scrollViewer!: InfiniteScrollViewer;

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
        this.scrollViewer.viewerElement.addEventListener("wheel", this.onWheel);
    }
    public componentWillUnmount() {
        this.scrollViewer.viewerElement.addEventListener("wheel", this.onWheel);
    }
    public scrollTo(scrollLeft: number, scrollTop: number) {
        this.scrollViewer.scrollTo(scrollLeft, scrollTop);
    }
    public getScrollPoses() {
        return this.scrollViewer.getScrollPoses();
    }
    public getViewerElement() {
        return this.scrollViewer.viewerElement;
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
}
