import Scene, { SceneItem } from "scenejs";
import Component from "@egjs/component";
import * as ReactDOM from "react-dom";
import * as React from "react";
import TimelineArea from "./components/TimelineArea";

export default class Timeline extends Component {
    public scene: Scene | SceneItem;
    public options: {
        keyboard?: boolean,
    };
    private timelineArea: TimelineArea;
    constructor(scene: Scene | SceneItem, parentEl: HTMLElement, options: {
        keyboard?: boolean,
    } = {}) {
        super();
        this.initStructure(scene, parentEl);
    }
    private initStructure(scene: Scene | SceneItem, parentEl: HTMLElement) {
        this.timelineArea = ReactDOM.render(
            <TimelineArea scene={scene} />,
            parentEl,
        ) as any;
    }
}
