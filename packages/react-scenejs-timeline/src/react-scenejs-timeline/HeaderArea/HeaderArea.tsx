import { TimelineInfo } from "../types";
import ElementComponent from "../utils/ElementComponent";
import KeytimesArea from "./KeytimesArea";
import * as React from "react";
import { prefix, ref } from "../utils";
import Axes from "@egjs/axes";
import Scene, { SceneItem } from "scenejs";

export default class HeaderArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    axes: Axes,
    scene?: Scene | SceneItem,
    add: (item?: Scene | SceneItem, properties?: string[]) => any,
    move: (clientX: number) => void,
}> {
    public keytimesArea!: KeytimesArea;
    public render() {
        const { axes, timelineInfo, maxTime, maxDuration, zoom, move } = this.props;
        return (
            <div className={prefix("header-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")}>Name</div>
                </div>
                <div className={prefix("values-area")}>
                    <div className={prefix("value")} >
                        <div className={prefix("add")} onClick={this.add}>+</div>
                    </div>
                </div>
                <KeytimesArea
                    ref={ref(this, "keytimesArea")}
                    move={move}
                    axes={axes}
                    timelineInfo={timelineInfo}
                    maxDuration={maxDuration}
                    maxTime={maxTime}
                    zoom={zoom} />
            </div>
        );
    }
    private add = () => {
        if (this.props.scene) {
            return;
        }
        this.props.add();
    }
}
