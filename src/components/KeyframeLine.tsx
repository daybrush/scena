import { Component } from "react";

export default class KeyframeLine extends Component<{
    id: string,
    time: number,
    nextTime: number,
    maxTime: number,
}> {
    public render() {
        const { time, nextTime, maxTime } = this.props;

        return (
            <div
                className="keyframe-line"
                style={{ left: `${time / maxTime * 100}%`, width: `${(nextTime - time) / maxTime * 100}%` }} />
        );
    }
}
