import { TimelineInfo } from "../types";
import * as React from "react";
import { prefix, ref } from "../utils";
import ElementComponent from "../utils/ElementComponent";
import KeyframeCursor from "../ScrollArea/KeyframesArea/KeyframeCursor";
import { addEvent } from "@daybrush/utils";
import Axes from "@egjs/axes";
import { drag } from "@daybrush/drag";

export default class KeytimesArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    axes: Axes,
    move: (clientX: number) => void,
}> {
    public scrollAreaElement!: HTMLElement;
    public cursor!: KeyframeCursor;

    public renderKeytimes() {
        const { maxTime } = this.props;
        const keytimes = [];

        for (let time = 0; time <= maxTime; ++time) {
            keytimes.push(
                <div key={time} data-time={time} className={prefix("keytime")} style={{ width: `${100 / maxTime}%` }}>
                    <span>{time}</span>
                    <div className={prefix("graduation start")} />
                    <div className={prefix("graduation quarter")} />
                    <div className={prefix("graduation half")} />
                    <div className={prefix("graduation quarter3")} />
                </div>,
            );
        }
        return keytimes;
    }
    public render() {
        const { maxTime, maxDuration, zoom } = this.props;
        return (
            <div className={prefix("keytimes-area keyframes-area")}>
                <div
                    className={prefix("keyframes-scroll-area")}
                    ref={ref(this, "scrollAreaElement")}
                    style={{
                        minWidth: `${50 * maxTime}px`,
                        width: `${Math.min(maxDuration ? maxTime / maxDuration : 1, 2) * zoom * 100}%`,
                    }}
                >
                    <div className={prefix("keytimes keyframes")}>
                        <div className={prefix("keyframes-container")}>
                            {this.renderKeytimes()}
                        </div>
                        <KeyframeCursor ref={ref(this, "cursor")}/>
                    </div>
                </div>
            </div>
        );
    }
    public componentDidMount() {
        addEvent(this.getElement(), "wheel", e => {
            const delta = e.deltaY;

            this.props.axes.setBy({ zoom: delta / 5000 });
            !e.deltaX && e.preventDefault();
        });
        drag(this.cursor!.getElement(), {
            dragstart: ({ inputEvent }) => {
                inputEvent.stopPropagation();
            },
            drag: ({ clientX }) => {
                this.props.move(clientX);
            },
            container: window,
        });
    }
}
