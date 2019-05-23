import { Component } from "react";

export default class Keyframe extends Component<{
    id: string,
    time: number,
    maxTime: number,
    iterationTime: number,
    value: string | undefined,
}> {
    public render() {
        const { time, value, maxTime } = this.props;
        return (<div className="keyframe" data-time={time} style={{ left: `${time / maxTime * 100}%` }}>
            {time} {value}
        </div>);
    }
}
