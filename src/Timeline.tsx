import PreactTimeline from "preact-timeline";
import EgComponent from "@egjs/component";
import { VNode, h, render, Component } from "preact";
import Scene, { SceneItem } from "scenejs";
import { TimelineProps, SelectEvent } from "./types";

export default class Timeline extends EgComponent {
    private timelineArea!: PreactTimeline;
    constructor(scene: Scene | SceneItem, parentElement: Element, options: TimelineProps = {}) {
        super();
        const element = document.createElement("div");
        render(
            <PreactTimeline
                ref={e => { e && (this.timelineArea = e as PreactTimeline) }}
                keyboard={true}
                {...options}
                scene={scene}
                onSelect={this.onSelect}
            />,
            element,
        );

        parentElement.appendChild(element.children[0]);
    }
    public update(isInit?: boolean) {
        this.timelineArea.update(isInit);
    }
    private onSelect = (e: SelectEvent) => {
        this.trigger("select", e);
    }
}
