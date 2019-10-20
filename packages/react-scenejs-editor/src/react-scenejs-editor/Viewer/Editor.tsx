import * as React from "react";
import styled from "react-css-styler";
import { EDITOR_CSS } from "./consts";
import { ref } from "framework-utils";
import Viewer from "./Viewer";

const EditorElement = styled("div", EDITOR_CSS);

export default class Editor extends React.PureComponent {
    private viewer!: Viewer;

    public render() {
        return (
            <EditorElement className="scenejs-editor">
                <Viewer ref={ref(this, "viewer")}
                    width={"500px"}
                    height={"500px"}
                >{this.props.children}</Viewer>
            </EditorElement>
        );
    }
    public componentDidMount() {
        this.viewer.onResize();
        this.viewer.restoreScroll();
    }
}
