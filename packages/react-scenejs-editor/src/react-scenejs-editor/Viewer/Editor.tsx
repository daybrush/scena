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
    };
    private viewer!: Viewer;
    private horizontalRuler!: Ruler;
    private verticalRuler!: Ruler;
    private horizontalGuidelines!: Guidelines;
    private verticalGuidelines!: Guidelines;
    private width: number = 0;
    private height: number = 0;
    public render() {
        const {
            verticalRange: [verticalMin, verticalMax],
            horizontalRange: [horizontalMin, horizontalMax],
        } = this.state;
        return (
            <EditorElement className="scenejs-editor">
                <div className={prefix("box")} onClick={this.restoreScroll}></div>
                <Ruler ref={ref(this, "horizontalRuler")}
                    type="horizontal" min={horizontalMin} max={horizontalMax} />
                <Ruler ref={ref(this, "verticalRuler")}
                    type="vertical" min={verticalMin} max={verticalMax} />
                <Guidelines ref={ref(this, "horizontalGuidelines")}
                    type="horizontal" offset={horizontalMin} />
                <Guidelines ref={ref(this, "verticalGuidelines")}
                    type="vertical" offset={verticalMin} />
                <Viewer ref={ref(this, "viewer")}
                    horizontalMin={horizontalMin} horizontalMax={horizontalMax}
                    verticalMin={verticalMin} verticalMax={verticalMax}
                    onScroll={this.onScroll}
                >{this.props.children}</Viewer>
            </EditorElement>
        );
    }
    public componentDidMount() {
        window.addEventListener("resize", this.onResize);

        this.onResize();
    }
    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }
    private restoreScroll = () => {
        this.viewer.restoreScroll();
    }
    private onScroll = () => {
        const viewerElement = this.viewer.viewerElement;
        const scrollLeft = viewerElement.scrollLeft;
        const scrollTop = viewerElement.scrollTop;

        this.scroll(scrollLeft, scrollTop);
    }
    private onResize = () => {
        const rect = this.viewer.viewerElement.getBoundingClientRect();

        this.width = rect.width;
        this.height = rect.height;

        this.onScroll();
    }
    private scroll(scrollLeft: number, scrollTop: number) {
        const {
            horizontalRange: stateHorizontalRange,
            verticalRange: stateVerticalRange,
        } = this.state;
        const width = this.width;
        const height = this.height;

        const relativeLeft = scrollLeft + stateHorizontalRange[0] * 50 - 100;
        const relativeTop = scrollTop + stateVerticalRange[0] * 50 - 100;
        const relativeRight = relativeLeft + width + 200;
        const relativeBottom = relativeTop + height + 200;

        const horizontalRange = [
            Math.min(Math.floor(relativeLeft / 50), -4, stateHorizontalRange[0]),
            Math.max(Math.ceil(relativeRight / 50), Math.ceil(width / 50) + 4),
        ];
        const verticalRange = [
            Math.min(Math.floor(relativeTop / 50), -4, stateVerticalRange[0]),
            Math.max(Math.ceil(relativeBottom / 50), Math.ceil(height / 50) + 4),
        ];

        const offsetLeft = (stateHorizontalRange[0] - horizontalRange[0]) * 50;
        const offsetTop = (stateVerticalRange[0] - verticalRange[0]) * 50;
        const nextScrollLeft = scrollLeft + offsetLeft;
        const nextScrollTop = scrollTop + offsetTop;

        this.horizontalRuler.scroll(scrollLeft + stateHorizontalRange[0] * 50);
        this.verticalRuler.scroll(scrollTop + stateVerticalRange[0] * 50);
        this.horizontalGuidelines.scroll(scrollTop + stateVerticalRange[0] * 50);
        this.verticalGuidelines.scroll(scrollLeft + stateHorizontalRange[0] * 50);

        if (
            horizontalRange[0] === stateHorizontalRange[0]
            && horizontalRange[1] === stateHorizontalRange[1]
            && verticalRange[0] === stateVerticalRange[0]
            && verticalRange[1] === stateVerticalRange[1]
        ) {
            return false;
        }
        this.setState({
            horizontalRange,
            verticalRange,
        }, () => {
            if (offsetLeft || offsetTop) {
                this.viewer.scroll(nextScrollLeft, nextScrollTop);
            }
        });

        return true;
    }
}
