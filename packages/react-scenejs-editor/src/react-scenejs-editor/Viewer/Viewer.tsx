import * as React from "react";
import { prefix } from "../utils";
import { ref } from "framework-utils";

export default class Viewer extends React.PureComponent<{
    horizontalMin: number,
    horizontalMax: number,
    verticalMin: number,
    verticalMax: number,
    onScroll: (e: any) => void,
    width?: number,
    height?: number,
}> {
    public static defaultProps = {
        width: "100%",
        height: "100%",
    };
    public viewerElement!: HTMLElement;
    public width: number = 0;
    public height: number = 0;
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
    public scroll(scrollLeft: number, scrollTop: number) {
        const viewerElement = this.viewerElement;

        viewerElement.scrollLeft = scrollLeft;
        viewerElement.scrollTop = scrollTop;
    }
    public restoreScroll() {
        const { horizontalMin, verticalMin } = this.props;
        this.scroll(-horizontalMin * 50, -verticalMin * 50);
    }
}
