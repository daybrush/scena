import * as React from "react";
import { prefix } from "../utils";

export default class KeyframeDelay extends React.Component<{
    id: string,
    time: number,
    nextTime: number,
    maxTime: number,
}> {
    public render() {
        const { time, nextTime, maxTime } = this.props;
        return (
            <div
                className={prefix("keyframe-delay")}
                style={{ left: `${time / maxTime * 100}%`, width: `${(nextTime - time) / maxTime * 100}%` }} />
        );
    }
}
