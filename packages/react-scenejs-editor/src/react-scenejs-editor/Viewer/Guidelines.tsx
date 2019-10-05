import * as React from "react";
import styled from "react-css-styler";
import { getTranslateName, findDOMRef } from "./utils";
import { prefix, addClass, removeClass, hasClass } from "../utils";
import { prefixCSS, ref, refs } from "framework-utils";
import Dragger from "@daybrush/drag";

const GuidelinesElement = styled("div", prefixCSS("scenejs-editor-", `
{
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
    z-index: 2000;
}
:host.horizontal {
    width: 100%;
    height: 0;
}
:host.vertical {
    height: 100%;
    width: 0;
}
.guideline {
    position: absolute;
    background: #f33;
    z-index: 2;
}
.guideline.dragging:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.guideline.horizontal {
    width: 100%;
    height: 1px;
    cursor: row-resize;
}
.guideline.vertical {
    width: 1px;
    height: 100%;
    cursor: col-resize;
}
.mobile .guideline.horizontal {
    transform: scale(1, 2);
}
.mobile .guideline.vertical {
    transform: scale(2, 1);
}
.guideline.horizontal:before {
    height: 20px;
}
.guideline.vertical:before {
    width: 20px;
}
.adder {
    display: none;
}
.adder.dragging {
    display: block;
}
`));

export default class Guidelines extends React.PureComponent<{
    type: "vertical" | "horizontal",
}> {
    public state = {
        guidelines: [],
    };
    public adderElement: HTMLElement;
    public scrollPos: number = 0;
    private guidelinesElement!: HTMLElement;
    private dragger!: Dragger;
    private guidelineElements: HTMLElement[] = [];
    public render() {
        const { type } = this.props;

        return (<GuidelinesElement className={prefix("guidelines", type)} ref={findDOMRef(this, "guidelinesElement")}>
            <div className={prefix("guideline adder", type)} ref={ref(this, "adderElement")} />
            {this.renderGuidelines()}
        </GuidelinesElement>);
    }
    public renderGuidelines() {
        const { type } = this.props;
        const translateName = getTranslateName(type);
        const guidelines = this.state.guidelines;

        this.guidelineElements = [];
        return guidelines.map((pos, i) => {
            return (<div className={prefix("guideline", type)}
                ref={refs(this, "guidelineElements", i)}
                key={i}
                data-index={i}
                style={{
                    transform: `${translateName}(${pos}px)`,
                }}></div>);
        });
    }
    public componentDidMount() {
        this.dragger = new Dragger(this.guidelinesElement, {
            container: document.body,
            dragstart: this.dragStartToChange,
            drag: this.drag,
            dragend: this.dragEnd,
        });
    }
    public componentWillUnmount() {
        this.dragger.unset();
    }
    public scroll(pos: number) {
        const { type } = this.props;
        const guidelinesElement = this.guidelinesElement;

        this.scrollPos = pos;
        guidelinesElement.style.transform = `${getTranslateName(type)}(${-pos}px)`;

        const guidelines = this.state.guidelines;
        this.guidelineElements.forEach((el, i) => {
            if (!el) {
                return;
            }
            el.style.display = -pos + guidelines[i] < 30 ? "none" : "block";
        });
    }
    public dragStartToChange = ({ datas, clientX, clientY, inputEvent }) => {
        const target = inputEvent.target;

        if (!hasClass(target, "guideline")) {
            return false;
        }
        datas.target = target;
        this.dragStart({ datas, clientX, clientY, inputEvent });
    }
    public dragStartToAdd = ({ datas, clientX, clientY, inputEvent }) => {
        datas.target = this.adderElement;
        this.dragStart({ datas, clientX, clientY, inputEvent });
    }
    public dragStart = ({ datas, clientX, clientY, inputEvent }) => {
        const isHorizontal = this.props.type === "horizontal";
        const rect = this.guidelinesElement.getBoundingClientRect();
        datas.offset = isHorizontal ? rect.top : rect.left;
        addClass(datas.target, "dragging");
        this.drag({ datas, clientX, clientY });

        inputEvent.stopPropagation();
        inputEvent.preventDefault();
    }
    public drag = ({ datas, clientX, clientY }) => {
        const type = this.props.type;
        const isHorizontal = type === "horizontal";
        const nextPos = (isHorizontal ? clientY : clientX) - datas.offset;

        datas.target.style.transform = `${getTranslateName(type)}(${nextPos}px)`;

        return nextPos;
    }
    public dragEnd = ({ datas, clientX, clientY }) => {
        const pos = this.drag({ datas, clientX, clientY });
        const guidelines = this.state.guidelines;
        removeClass(datas.target, "dragging");

        if (datas.fromRuler) {
            if (pos >= this.scrollPos + 30) {
                this.setState({
                    guidelines: [...guidelines, pos],
                });
            }
        } else {
            const index = datas.target.getAttribute("data-index");

            if (pos < this.scrollPos + 30) {
                guidelines.splice(index, 1);
            } else {
                guidelines[index] = pos;
            }
            this.setState({
                guidelines: [...guidelines],
            });
        }
    }
}
