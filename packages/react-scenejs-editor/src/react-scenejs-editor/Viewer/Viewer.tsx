import * as React from "react";
import { ref, prefixCSS } from "framework-utils";
import KeyController from "keycon";
import InfiniteScrollViewer from "../InfiniteScrollViewer/InfiniteScrollViewer";
import { RANGE } from "./consts";
import { prefix } from "../utils";
import styled from "react-css-styler";
import { PREFIX } from "../consts";
import Guides from "@scena/react-guides";

KeyController.setGlobal();
const ViewerElement = styled("div", prefixCSS(PREFIX, `
{
    position: relative;
    width: 100%;
    height: 100%;
}
.scroll-viewer {
    position: absolute;
    left: 30px;
    top: 30px;
    width: calc(100% - 30px);
    height: calc(100% - 30px);
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
    z-index: 21;
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
.guides {
    position: absolute;
    top: 0;
    left: 0;
}
.guides.horizontal {
    width: 100%;
    height: 0;
}
.guides.vertical {
    height: 100%;
    width: 0;
}
`));
export default class Viewer extends React.PureComponent<{
    width?: string,
    height?: string,
    externalChildren?: React.ReactNode | React.ReactNode[],
    onScroll: () => any,
}> {
    public scrollViewer!: InfiniteScrollViewer;
    public state = {
        zoom: 1,
        offsetWidth: 0,
        offsetHeight: 0,
    };
    private horizontalGuides!: Guides;
    private verticalGuides!: Guides;
    public render() {
        const {
            width,
            height,
            children,
            externalChildren,
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
            <InfiniteScrollViewer
                ref={ref(this, "scrollViewer")}
                width={width}
                height={height}
                zoom={zoom}
                externalChildren={externalChildren}
                onScroll={this.onScroll} range={RANGE} threshold={100}>
                {children}
            </InfiniteScrollViewer>
            <div className={prefix("box")} onClick={this.restoreScroll}></div>
            <Guides
                ref={ref(this, "verticalGuides")}
                className={prefix("guides", "vertical")}
                type={"vertical"}
                width={30}
                height={offsetHeight}
                unit={unit}
                zoom={zoom}
                setGuides={this.setGuides}
                style={{ width: "30px", height: `${offsetHeight}px` }}
                />
            <Guides
                ref={ref(this, "horizontalGuides")}
                type={"horizontal"}
                className={prefix("guides", "horizontal")}
                width={offsetWidth}
                height={30}
                unit={unit}
                zoom={zoom}
                setGuides={this.setGuides}
                style={{ width: `${offsetWidth}px`, height: `30px` }}
                rulerStyle={{left: "30px", width: `calc(100% - 30px)`}}
                />
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
        this.props.onScroll();
    }
    private setGuides = () => {
        const verticalGuides = this.verticalGuides.getGuides();
        const horizontalGuides = this.horizontalGuides.getGuides();

        console.log(verticalGuides, horizontalGuides);
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

        this.horizontalGuides.scroll(relativeLeft);
        this.horizontalGuides.scrollGuides(relativeTop);
        this.verticalGuides.scroll(relativeTop);
        this.verticalGuides.scrollGuides(relativeLeft);
    }
}
