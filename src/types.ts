import { TimelineAttributes, SelectEvent as PreactSelectEvent } from "preact-timeline";

export type SelectEvent = PreactSelectEvent;
export interface TimelineProps extends TimelineAttributes {
    keyboard?: boolean;
}
