import * as React from "react";
import { ref, prefixCSS } from "framework-utils";
import KeyController from "keycon";
import InfiniteScrollViewer from "../InfiniteScrollViewer/InfiniteScrollViewer";
import { RANGE } from "./consts";
import { prefix } from "../utils";
import Ruler from "./Ruler";
import Guidelines from "./Guidelines";
import styled from "react-css-styler";
import { PREFIX } from "../consts";

KeyController.setGlobal();
const ViewerElement = styled("div", prefixCSS(PREFIX, `
{
    position: relative;
    width: 100%;
    height: 100%;
}
.scroller {
    position: absolute;
    width: 100%;
    height: 100%;
}
.container-area {
    position: absolute;
    background: #f55;
    width: 100%;
    height: 100%;
}
.box {
    position: relative;
    width: 30px;
    height: 30px;
    background: #444;
    box-sizing: border-box;
    z-index: 20;
}
.box:before, .box:after {
    position: absolute;
    content: "";
    background: #777;
}
.box:before {
    width: 1px;
    height: 100%;
    left: 100%;
}
.box:after {
    height: 1px;
    width: 100%;
    top: 100%;
}
.container {
    transform-origin: 0% 0%;
    background: rgba(200, 200, 200, 0.2);
}
`));
export default class Viewer extends React.PureComponent<{
    width?: string,
    height?: string,
}> {
    public scrollViewer!: InfiniteScrollViewer;
    public state = {
        zoom: 1,
        offsetWidth: 0,
        offsetHeight: 0,
    };
    private horizontalRuler!: Ruler;
    private verticalRuler!: Ruler;
    private horizontalGuidelines!: Guidelines;
    private verticalGuidelines!: Guidelines;
    public render() {
        const {
            width,
            height,
            children,
        } = this.props;
        const {
            zoom,
            offsetWidth,
            offsetHeight,
        } = this.state;
        const unit = zoom * zoom >= 1
            ? Math.max(Math.round(50 / zoom / 10) * 10, 5)
            : Math.max(50 * Math.round(1 / zoom), 1);

        return (<ViewerElement className={prefix("viewer")}>
            <div className={prefix("box")} onClick={this.restoreScroll}></div>
            <Ruler ref={ref(this, "horizontalRuler")}
                type="horizontal"
                width={offsetWidth}
                height={30}
                unit={unit}
                onDragStart={this.dragStartHorizontal}
                onDrag={this.dragHorizontal}
                onDragEnd={this.dragEndHorizontal}
                zoom={zoom}
            />
            <Ruler ref={ref(this, "verticalRuler")}
                type="vertical"
                width={30}
                height={offsetHeight}
                unit={unit}
                onDragStart={this.dragStartVertical}
                onDrag={this.dragVertical}
                onDragEnd={this.dragEndVertical}
                zoom={zoom}
            />
            <Guidelines ref={ref(this, "horizontalGuidelines")}
                setGuidelines={this.setGuidelines}
                type="horizontal"
                zoom={zoom}
            />
            <Guidelines ref={ref(this, "verticalGuidelines")}
                setGuidelines={this.setGuidelines}
                type="vertical"
                zoom={zoom}
            />
            <InfiniteScrollViewer
                ref={ref(this, "scrollViewer")}
                width={width}
                height={height}
                zoom={zoom}
                onScroll={this.onScroll} range={RANGE} threshold={100}>
                {children}
            </InfiniteScrollViewer>
        </ViewerElement>);
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
    public onResize = () => {
        const viewerElement = this.getViewerElement();

        this.setState({
            offsetWidth: viewerElement.offsetWidth,
            offsetHeight: viewerElement.offsetHeight,
        });
    }
    public restoreScroll = () => {
        const zoom = this.state.zoom;
        const {
            offsetWidth: viewerOffsetWidth,
            offsetHeight: viewerOffsetHeight,
        } = this.getViewerElement();
        const {
            offsetWidth: containerOffsetWidth,
            offsetHeight: containerOffsetHeight,
        } = this.getContainerElement();
        const left = -(viewerOffsetWidth - containerOffsetWidth * zoom) / 2;
        const top = -(viewerOffsetHeight - containerOffsetHeight * zoom) / 2;

        this.scrollTo(left, top);
    }
    private onWheel = (e: WheelEvent) => {
        const { deltaY } = e;

        if (!KeyController.global.metaKey || !deltaY) {
            return;
        }
        e.preventDefault();

        const sign = deltaY >= 0 ? 1 : -1;
        const delta = Math.min(Math.abs(deltaY) / 500, 0.03);

        this.setZoom(Math.max(this.state.zoom * (1 + sign * delta), 0.2));
    }

    private onScroll = () => {
        const [scrollLeft, scrollTop] = this.getScrollPoses();

        this.scroll(scrollLeft, scrollTop);
    }
    private dragStartHorizontal = e => {
        this.horizontalGuidelines.dragStartToAdd(e);
    }
    private dragHorizontal = e => {
        this.horizontalGuidelines.drag(e);
    }
    private dragEndHorizontal = e => {
        this.horizontalGuidelines.dragEnd(e);
    }
    private dragStartVertical = e => {
        this.verticalGuidelines.dragStartToAdd(e);
    }
    private dragVertical = e => {
        this.verticalGuidelines.drag(e);
    }
    private dragEndVertical = e => {
        this.verticalGuidelines.dragEnd(e);
    }
    private setGuidelines = () => {
        const verticalGuidelines = this.verticalGuidelines.getGuidelines();
        const horizontalGuidelines = this.horizontalGuidelines.getGuidelines();

        console.log(verticalGuidelines, horizontalGuidelines);
    }
    private setZoom = (zoom: number) => {
        const {
            zoom: prevZoom,
            offsetWidth,
            offsetHeight,
        } = this.state;

        this.setState({
            zoom,
        }, () => {
            const scrollPos = this.getScrollPoses();

            const halfWidth = -offsetWidth / 2;
            const halfHeight = -offsetHeight / 2;
            const scale = zoom / prevZoom - 1;
            this.scrollTo(
                scrollPos[0] + (scrollPos[0] - halfWidth) * scale,
                scrollPos[1] + (scrollPos[1] - halfHeight) * scale,
            );
        });
    }
    private scroll(scrollLeft: number, scrollTop: number) {
        const {
            zoom,
        } = this.state;

        const relativeLeft = scrollLeft / zoom;
        const relativeTop = scrollTop / zoom;

        this.horizontalRuler.scroll(relativeLeft);
        this.verticalRuler.scroll(relativeTop);

        this.horizontalGuidelines.scroll(relativeTop);
        this.verticalGuidelines.scroll(relativeLeft);
    }
}
