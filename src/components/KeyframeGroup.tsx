import { Component } from "react";

export default class KeyframeGroup extends Component<{
    id: string,
    time: number,
    nextTime: number,
    maxTime: number,
}> {
    public render() {
        const { time, nextTime, maxTime } = this.props;
        return (
            <div
                className="keyframe-group"
                data-time={time}
                style={{ left: `${time / maxTime * 100}%`, width: `${(nextTime - time) / maxTime * 100}%` }} />
        );
    }
}
