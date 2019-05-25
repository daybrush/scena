import { TimelineInfo } from "../types";
import ElementComponent from "./ElementComponent";
import KeyframesArea from "./KeyframesArea";
import PropertiesArea from "./PropertiesArea";
import ValuesArea from "./ValuesArea";
import * as React from "react";
import { prefix, ref } from "../utils";
import Axes from "@egjs/axes";
import KeyController from "keycon";

export default class ScrollArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    axes: Axes,
    keycon: KeyController,
    selectedProperty: string,
    selectedTime: number,
}> {
    public propertiesArea: PropertiesArea;
    public valuesArea: ValuesArea;
    public keyframesArea: KeyframesArea;
    public render() {
        const {
            axes, keycon, zoom, maxDuration, maxTime, timelineInfo,
            selectedProperty, selectedTime,
        } = this.props;

        return (
            <div className={prefix("scroll-area")}>
                <PropertiesArea
                    ref={ref(this, "propertiesArea")}
                    timelineInfo={timelineInfo}
                    selectedProperty={selectedProperty}
                />
                <ValuesArea
                    ref={ref(this, "valuesArea")}
                    timelineInfo={timelineInfo}
                    selectedProperty={selectedProperty}
                />
                <KeyframesArea
                    ref={ref(this, "keyframesArea")}
                    axes={axes}
                    keycon={keycon}
                    zoom={zoom}
                    maxDuration={maxDuration}
                    timelineInfo={timelineInfo}
                    maxTime={maxTime}
                    selectedProperty={selectedProperty}
                    selectedTime={selectedTime}
                />
            </div>
        );
    }
}
