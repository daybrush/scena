import * as React from "react";
import styled from "react-css-styler";
import { prefixCSS, ref } from "framework-utils";
import { prefix } from "../utils";
import { PREFIX } from "../consts";
import { findDOMRef, measureSpeed, getDuration, getDestPos } from "./utils";
import Dragger from "@daybrush/drag";

const ScrollerElement = styled("div", prefixCSS(PREFIX, `
{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
}
:host::-webkit-scrollbar {
    display: none;
}
.scroll-area {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 400px);
    height: calc(100% + 400px);
}
`));

export default class InfiniteScrollViewer extends React.PureComponent<{
    range?: number,
    threshold?: number,
    width?: string,
    height?: string,
    zoom?: number,
    onScroll: () => any,
}> {
    public static defaultProps = {
        range: 500,
        threhold: 100,
        width: "100%",
        height: "100%",
        zoom: 1,
        onScroll: () => { },
    };
    public state = {
        loopX: 0,
        loopY: 0,
        offsetX: 0,
        offsetY: 0,
    };
    public scrollTop: number = 500;
    public scrollLeft: number = 500;
    public viewerElement!: HTMLElement;
    public containerElement!: HTMLElement;
    private dragger!: Dragger;
    private timer: number = 0;

    public render() {
        const {
            width,
            height,
            zoom,
            range,
        } = this.props;
        const {
            loopX,
            loopY,
            offsetX,
            offsetY,
        } = this.state;

        const nextOffsetX = (1 - loopX) * range + offsetX;
        const nextOffsetY = (1 - loopY) * range + offsetY;
        const transform = `translate(${nextOffsetX}px, ${nextOffsetY}px) scale(${zoom})`;
        const size = `calc(100% + ${this.props.range * 2}px)`;

        return (
            <ScrollerElement ref={findDOMRef(this, "viewerElement")}
                className={prefix("scroll-viewer")}
                onScroll={this.onScroll}>
                <div className={prefix("scroll-area")} style={{
                    width: size,
                    height: size,
                }}></div>
                <div className={prefix("container")} ref={ref(this, "containerElement")} style={{
                    width,
                    height,
                    transform,
                }}>
                    {this.props.children}
                </div>
            </ScrollerElement>
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
                this.pauseAnimation();
            },
            drag: e => {
                measureSpeed(e);
                this.scrollBy(-e.deltaX, -e.deltaY);
            },
            dragend: e => {
                this.startAnimation(e.datas.speed);
            },
        });
        const range = this.props.range;
        this.move(range, range);
    }
    public componentWillUnmount() {
        this.dragger.unset();
    }
    public getScrollPoses() {
        const {
            loopX,
            loopY,
            offsetX,
            offsetY,
        } = this.state;
        const range = this.props.range;
        const nextScrollLeft = this.scrollLeft + (loopX - 1) * range - offsetX;
        const nextScrollTop = this.scrollTop + (loopY - 1) * range - offsetY;

        return [
            nextScrollLeft,
            nextScrollTop,
        ];
    }
    public scrollBy(deltaX: number, deltaY: number) {
        const scrollPoses = this.getScrollPoses();

        this.scrollTo(scrollPoses[0] + deltaX, scrollPoses[1] + deltaY);
    }
    public scrollTo(scrollLeft: number, scrollTop: number) {
        const range = this.props.range;

        const loopX = Math.floor((range + scrollLeft) / range);
        const loopY = Math.floor((range + scrollTop) / range);

        this.setState({
            loopX,
            loopY,
            offsetX: (loopX - 1) * range - scrollLeft + this.scrollLeft,
            offsetY: (loopY - 1) * range - scrollTop + this.scrollTop,
        }, () => {
            this.props.onScroll();
        });
    }
    private onScroll = () => {
        const viewerElement = this.viewerElement;
        const { scrollLeft, scrollTop } = viewerElement;
        const { range, threshold } = this.props;
        const endThreshold = range * 2 - threshold;
        const {
            loopX,
            loopY,
        } = this.state;
        let nextLoopX = loopX;
        let nextLoopY = loopY;

        let nextScrollLeft = scrollLeft;
        let nextScrollTop = scrollTop;

        if (scrollLeft < threshold) {
            nextScrollLeft = scrollLeft + range;
            --nextLoopX;
        } else if (scrollLeft > endThreshold) {
            nextScrollLeft = scrollLeft - range;
            ++nextLoopX;
        }
        if (scrollTop < threshold) {
            nextScrollTop = scrollTop + range;
            --nextLoopY;
        } else if (scrollTop > endThreshold) {
            nextScrollTop = scrollTop - range;
            ++nextLoopY;
        }
        this.scrollLeft = nextScrollLeft;
        this.scrollTop = nextScrollTop;

        this.setState({
            loopX: nextLoopX,
            loopY: nextLoopY,
        });
        this.props.onScroll();

        if (scrollLeft !== nextScrollLeft || scrollTop !== nextScrollTop) {
            this.move(nextScrollLeft, nextScrollTop);
        }
    }
    private move(scrollLeft: number, scrollTop: number) {
        const viewerElement = this.viewerElement;

        viewerElement.scrollLeft = scrollLeft;
        viewerElement.scrollTop = scrollTop;
    }
    private startAnimation(speed: number[]) {
        if (!speed || (!speed[0] && !speed[1])) {
            return;
        }
        const a = -0.0006;
        const easing = x => 1 - Math.pow(1 - x, 3);
        const duration = getDuration(speed, a);
        const destPos = getDestPos(speed, a);
        const startTime = Date.now();
        let prevTime = startTime;

        const next = () => {
            const now = Date.now();
            let t = now - startTime;

            if (duration < t) {
                t = duration;
            }
            const ratio = easing(t / duration);
            const prevRatio = easing((prevTime - startTime) / duration);

            prevTime = now;

            this.scrollBy(
                -destPos[0] * (ratio - prevRatio),
                -destPos[1] * (ratio - prevRatio),
            );

            if (t >= duration) {
                return;
            }
            this.timer = requestAnimationFrame(next);
        };
        this.timer = requestAnimationFrame(next);
    }
    pauseAnimation() {
        cancelAnimationFrame(this.timer);
    }
}
