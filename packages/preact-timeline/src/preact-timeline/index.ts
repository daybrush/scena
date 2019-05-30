import ReactTimeline from "react-scenejs-timeline";
import { h, Component } from "preact";
import { TimelineProps } from "./types";

export default class Timeline extends Component<TimelineProps> {
    private timeline: any;
    public render() {
        return h(ReactTimeline as any, {
            ...this.props,
            ref: (e: any) => { this.timeline = e; },
        });
    }
    public update(isInit?: boolean) {
        this.timeline.update(isInit);
    }
    public prev() {
        this.timeline.prev();
    }
    public next() {
        this.timeline.next();
    }
    public finish() {
        this.timeline.finish();
    }
    public togglePlay() {
        this.timeline.togglePlay();
    }
}
