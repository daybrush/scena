import { TimelineInfo } from "../types";
import ElementComponent from "./ElementComponent";
import KeytimesArea from "./KeytimesArea";
import * as React from "react";
import { prefix } from "../utils";
import Axes from "@egjs/axes";

export default class HeaderArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    axes: Axes,
    move: (clientX: number) => void,
}> {
    public keytimesArea: KeytimesArea;
    public render() {
        const { axes, timelineInfo, maxTime, maxDuration, zoom, move } = this.props;
        return (
            <div className={prefix("header-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")}>Name</div>
                </div>
                <div className={prefix("values-area")}>
                    <div className={prefix("value")}>
                        <div className={prefix("add")}>+</div>
                    </div>
                </div>
                <KeytimesArea
                    ref={e => { this.keytimesArea = e; }}
                    move={move}
                    axes={axes}
                    timelineInfo={timelineInfo}
                    maxDuration={maxDuration}
                    maxTime={maxTime}
                    zoom={zoom} />
            </div>
        );
    }
}
