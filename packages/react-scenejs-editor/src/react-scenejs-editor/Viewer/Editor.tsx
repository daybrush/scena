import * as React from "react";
import styled from "react-css-styler";
import { EDITOR_CSS } from "./consts";
import { ref } from "framework-utils";
import Viewer from "./Viewer";
import Moveable, { OnDrag, OnResize, OnRotate, OnRotateEnd, OnRotateGroup, OnRotateStart } from "react-moveable";

const EditorElement = styled("div", EDITOR_CSS);

export default class Editor extends React.PureComponent<{}, {
    selectedTarget: HTMLElement | null,
    container: HTMLElement | null,
}> {
    public state = {
        container: null,
        selectedTarget: null,
    };
    private viewer!: Viewer;
    private moveable!: Moveable;
    private editorElement!: HTMLElement;
    public render() {

        return (
            <EditorElement className="scenejs-editor" ref={ref(this, "editorElement")}>
                <Viewer ref={ref(this, "viewer")}
                    width={"500px"}
                    height={"500px"}
                    onScroll={this.onScroll}
                    externalChildren={this.renderMoveable()}
                >
                    {this.props.children}
                </Viewer>
            </EditorElement>
        );
    }
    public renderMoveable() {
        const {
            selectedTarget,
            container,
        } = this.state;

        return (<Moveable
            key="moveable"
            target={selectedTarget}
            draggable={true}
            resizable={true}
            rotatable={true}
            throttleDrag={1}
            throttleResize={1}
            throttleRotate={1}
            container={container}
            // onDragStart={this.onDragStart}
            onDrag={this.onDrag}
            // onDragEnd={this.onDragEnd}
            ref={ref(this, "moveable")} />);
    }
    public componentDidMount() {
        this.viewer.onResize();
        this.viewer.restoreScroll();

        this.setState({
            container: this.viewer.getViewerElement(),
            selectedTarget: document.querySelector(".clapper .bottom"),
        });
    }
    private onScroll = () => {
        this.moveable.updateRect();
    }
    private onDragStart = ({}) => {

    }
    private onDrag = ({ clientX, clientY, target, left, top, transform }: OnDrag) => {
        // target.style.left = `${left}px`;
        // target.style.top = `${top}px`;
        target.style.transform = transform;

        // this.setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
    }

    private onRenderEnd = () => {

    }
}
