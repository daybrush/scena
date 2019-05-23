import { Component } from "react";
import { TimelineInfo } from "../types";
import Keyframes from "./Keyframes";

export default class KeyframesList extends Component<{
    timelineInfo: TimelineInfo,
    maxTime: number,
}> {
    public render() {
        const {timelineInfo, maxTime} = this.props;
        const keyframesList: JSX.Element[] = [];

        for (const key in timelineInfo) {
            const propertiesInfo = timelineInfo[key];

            keyframesList.push(
                <Keyframes
                    key = {key}
                    id = {key}
                    propertiesInfo = {propertiesInfo}
                    maxTime = {maxTime} />,
            );
        }

        return keyframesList;
    }
}
