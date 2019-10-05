import * as React from "react";
import { prefix } from "../utils";
import { ref } from "framework-utils";
import Dragger from "@daybrush/drag";

export default class Viewer extends React.PureComponent<{
    horizontalMin: number,
    horizontalMax: number,
    verticalMin: number,
    verticalMax: number,
    onScroll: () => void,
    width?: string,
    height?: string,
}> {
    public static defaultProps = {
        width: "100%",
        height: "100%",
    };
    public viewerElement!: HTMLElement;
    public width: number = 0;
    public height: number = 0;
    public dragger!: Dragger;
    public render() {
        const {
            horizontalMin,
            horizontalMax,
            verticalMin,
            verticalMax,
            onScroll,
            width,
            height,
        } = this.props;
        const scrollWidth = `${(horizontalMax - horizontalMin) * 50}px`;
        const scrollHeight = `${(verticalMax - verticalMin) * 50}px`;
        const transform = `translate(${-horizontalMin * 50}px, ${-verticalMin * 50}px)`;

        return (
            <div className={prefix("viewer")} ref={ref(this, "viewerElement")} onScroll={onScroll}>
                <div className={prefix("scroller")} ref={ref(this, "scrollerElement")} style={{
                    width: scrollWidth,
                    height: scrollHeight,
                }}></div>
                <div className={prefix("container")} ref={ref(this, "containerElement")} style={{
                    width,
                    height,
                    transform,
                }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
    public componentDidMount() {
        // for touch device
        // scrollTop, scrollLeft are not directly reflected.
        this.dragger = new Dragger(this.viewerElement, {
            container: document.body,
            events: ["touch"],
            dragstart: ({ inputEvent }) => {
                inputEvent.preventDefault();
            },
            drag: e => {
                this.scrollBy(-e.deltaX, -e.deltaY);
            },
        });
        window.addEventListener("resize", this.onResize);
    }
    public componentWillUnmount() {
        this.dragger.unset();
        window.removeEventListener("resize", this.onResize);
    }
    public getScrollPos() {
        const viewerElement = this.viewerElement;

        return [
            viewerElement.scrollLeft,
            viewerElement.scrollTop,
        ];
    }
    public scrollBy(scrollLeft: number, scrollTop: number) {
        const viewerElement = this.viewerElement;

        viewerElement.scrollLeft += scrollLeft;
        viewerElement.scrollTop += scrollTop;
    }
    public scroll(scrollLeft: number, scrollTop: number) {
        const viewerElement = this.viewerElement;

        viewerElement.scrollLeft = scrollLeft;
        viewerElement.scrollTop = scrollTop;
    }
    public restoreScroll() {
        const { horizontalMin, verticalMin } = this.props;
        this.scroll(-horizontalMin * 50, -verticalMin * 50);
    }
    public onResize = () => {
        const rect = this.viewerElement.getBoundingClientRect();

        this.width = rect.width;
        this.height = rect.height;
    }
}
