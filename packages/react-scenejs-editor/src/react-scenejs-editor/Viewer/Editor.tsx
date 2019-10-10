import * as React from "react";
import styled from "react-css-styler";
import { EDITOR_CSS } from "./consts";
import { prefix } from "../utils";
import Ruler from "./Ruler";
import { ref } from "framework-utils";
import Viewer from "./Viewer";
import Guidelines from "./Guidelines";

const EditorElement = styled("div", EDITOR_CSS);

export default class Editor extends React.PureComponent {
    public state = {
        horizontalRange: [0, 5],
        verticalRange: [0, 5],
        zoom: 1,
    };
    private viewer!: Viewer;
    private horizontalRuler!: Ruler;
    private verticalRuler!: Ruler;
    private horizontalGuidelines!: Guidelines;
    private verticalGuidelines!: Guidelines;
    public render() {
        const {
            verticalRange: [verticalMin, verticalMax],
            horizontalRange: [horizontalMin, horizontalMax],
            zoom,
        } = this.state;
        return (
            <EditorElement className="scenejs-editor">
                <div className={prefix("box")} onClick={this.restoreScroll}></div>
                <Ruler ref={ref(this, "horizontalRuler")}
                    type="horizontal" min={horizontalMin} max={horizontalMax}
                    dragStart={this.dragStartHorizontal}
                    drag={this.dragHorizontal}
                    dragEnd={this.dragEndHorizontal}
                    zoom={zoom}
                />
                <Ruler ref={ref(this, "verticalRuler")}
                    type="vertical" min={verticalMin} max={verticalMax}
                    dragStart={this.dragStartVertical}
                    drag={this.dragVertical}
                    dragEnd={this.dragEndVertical}
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
                <Viewer ref={ref(this, "viewer")}
                    width={"500px"}
                    height={"500px"}
                    zoom={zoom}
                    onScroll={this.onScroll}
                    setZoom={this.setZoom}
                >{this.props.children}</Viewer>
            </EditorElement>
        );
    }
    public componentDidMount() {
        this.viewer.scrollViewer.onResize();
        this.restoreScroll();
    }
    private restoreScroll = () => {
        const viewer = this.viewer;
        const zoom = this.state.zoom;
        const {
            offsetWidth: viewerOffsetWidth,
            offsetHeight: viewerOffsetHeight,
        } = viewer.getViewerElement();
        const {
            offsetWidth: containerOffsetWidth,
            offsetHeight: containerOffsetHeight,
        } = viewer.getContainerElement();
        const left = -(viewerOffsetWidth - containerOffsetWidth * zoom) / 2;
        const top = -(viewerOffsetHeight - containerOffsetHeight * zoom) / 2;

        viewer.scrollTo(left, top);
    }
    private onScroll = () => {
        const [scrollLeft, scrollTop] = this.viewer.getScrollPoses();

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
        const prevZoom = this.state.zoom;

        this.setState({
            zoom,
        }, () => {
            const scrollPos = this.viewer.getScrollPoses();

            const halfWidth = -this.viewer.scrollViewer.offsetWidth / 2;
            const halfHeight = -this.viewer.scrollViewer.offsetHeight / 2;
            const scale = zoom / prevZoom - 1;
            this.viewer.scrollTo(
                scrollPos[0] + (scrollPos[0] - halfWidth) * scale,
                scrollPos[1] + (scrollPos[1] - halfHeight) * scale,
            );
        });
    }
    private scroll(scrollLeft: number, scrollTop: number) {
        const {
            horizontalRange: stateHorizontalRange,
            verticalRange: stateVerticalRange,
            zoom,
        } = this.state;
        const width = this.viewer.scrollViewer.offsetWidth;
        const height = this.viewer.scrollViewer.offsetHeight;

        const relativeLeft = scrollLeft / zoom;
        const relativeTop = scrollTop / zoom;

        const boundLeft = relativeLeft - 100;
        const boundTop = relativeTop - 100;
        const boundRight = relativeLeft + width / zoom + 100;
        const boundBottom = relativeTop + height / zoom + 100;

        const horizontalRange = [
            Math.min(Math.floor(boundLeft / 200) * 4, -4, stateHorizontalRange[0]),
            Math.max(Math.ceil(boundRight / 200) * 4, 4, Math.ceil(width / 100) * 2 + 4),
        ];
        const verticalRange = [
            Math.min(Math.floor(boundTop / 200) * 4, -4, stateVerticalRange[0]),
            Math.max(Math.ceil(boundBottom / 200) * 4, 4, Math.ceil(height / 100) * 2 + 4),
        ];

        const offsetLeft = (stateHorizontalRange[0] - horizontalRange[0]) * 50;
        const offsetTop = (stateVerticalRange[0] - verticalRange[0]) * 50;

        this.horizontalRuler.scroll(relativeLeft);
        this.verticalRuler.scroll(relativeTop);

        this.horizontalGuidelines.scroll(relativeTop);
        this.verticalGuidelines.scroll(relativeLeft);

        if (
            !offsetLeft && !offsetTop
            && horizontalRange[1] === stateHorizontalRange[1]
            && verticalRange[1] === stateVerticalRange[1]
        ) {
            return false;
        }
        this.setState({
            horizontalRange,
            verticalRange,
        });

        return true;
    }
}
