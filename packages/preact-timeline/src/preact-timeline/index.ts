import ReactTimeline from "react-scenejs-timeline";
import { h, Component } from "preact";
import { TimelineProps } from "./types";

export default class Timeline extends Component<TimelineProps> {
    public render() {
        return h(ReactTimeline as any, this.props);
    }
}
