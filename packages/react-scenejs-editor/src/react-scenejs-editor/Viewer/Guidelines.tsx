import * as React from "react";
import styled from "react-css-styler";
import { getTranslateName, findDOMRef } from "./utils";
import { prefix } from "../utils";
import { prefixCSS, ref } from "framework-utils";

const GuidelinesElement = styled("div", prefixCSS("scenejs-editor-", `
{
    position: absolute;
    top: 0;
    left: 0;
}
:host.horizontal {
    width: 100%;
    height: 0;
}
:host.vertical {
    height: 100%;
    width: 0;
}
`));

export default class Guidelines extends React.PureComponent<{
    type: "vertical" | "horizontal",
    offset: number,
}> {
    private guidelinesElement!: HTMLElement;
    public render() {
        const { type } = this.props;

        return (<GuidelinesElement className={prefix("guidelines", type)} ref={findDOMRef(this, "guidelinesElement")}>
            {this.renderGuidelines()}
        </GuidelinesElement>);
    }
    public renderGuidelines() {
        const { type } = this.props;
        const translateName = getTranslateName(type);
        const guidelines = [
            100,
            200,
        ];

        return guidelines.map(guideline => {
            return (<div className={prefix("guideline", type)}
            data-type={type}
            data-position={guideline}
            style={{
                transform: `${translateName}(${guideline}px)`,
            }}></div>);
        });
    }
    public scroll(pos: number) {
        const { type } = this.props;
        const guidelinesElement = this.guidelinesElement;

        guidelinesElement.style.transform = `${getTranslateName(type)}(${-pos}px)`;
    }
}
