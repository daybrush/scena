import * as React from "react";
import { prefix } from "../utils";

export default class KeyframeGroup extends React.Component<{
    id: string,
    time: number,
    nextTime: number,
    maxTime: number,
    selected: boolean,
}> {
    public render() {
        const { time, nextTime, maxTime, selected } = this.props;
        return (
            <div
                className={prefix("keyframe-group" + (selected ? " select" : ""))}
                data-time={time}
                style={{ left: `${time / maxTime * 100}%`, width: `${(nextTime - time) / maxTime * 100}%` }} />
        );
    }
}
