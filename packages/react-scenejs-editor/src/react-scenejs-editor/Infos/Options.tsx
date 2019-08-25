import * as React from "react";
import Scene, { SceneItem, DirectionType, FillModeType } from "scenejs";
import { prefix, isSceneItem } from "../../utils";
import Option from "./Option";
import {  DIRECTIONS, FILL_MODES } from "../../consts";

export default class Options extends React.Component<{
    scene: Scene | SceneItem,
    onUpdate: () => void,
}> {
    public render() {
        const { scene } = this.props;

        return (
            <div className={prefix("info")}>
                <div className={prefix("option title")}><h3>Options</h3></div>
                <Option type="number" name="delay" value={scene && scene.getDelay()} setCallback={this.setDelay} />
                <Option name="easing" value={scene && scene.getEasingName()} setCallback={this.setEasing} />
                <Option name="iterationCount"
                    value={scene && scene.getIterationCount()} setCallback={this.setIterationCount} />
                <Option name="playSpeed"
                    type="number"
                    value={scene && scene.getPlaySpeed()} setCallback={this.setPlaySpeed} />
                <Option name="fillMode"
                    type="select" param={FILL_MODES}
                    value={scene && scene.getFillMode()} setCallback={this.setFillMode} />
                <Option name="direction"
                    type="select" param={DIRECTIONS}
                    value={scene && scene.getDirection()} setCallback={this.setDirection} />
                <Option name="duration"
                    type="number"
                    value={scene && scene.getDuration()} setCallback={this.setDuration} />
                {isSceneItem(scene) ? <Option name="lastFrame"
                    type="number"
                    value={scene && scene.getDuration()} setCallback={this.setLastFrame} /> : undefined}
            </div>);
    }
    private setDelay = (name: any, value: string) => {
        const { scene } = this.props;

        scene && scene.setDelay(parseFloat(value));
        this.props.onUpdate();
    }
    private setPlaySpeed = (name: any, value: string) => {
        const { scene } = this.props;

        scene && scene.setPlaySpeed(parseFloat(value));
        this.props.onUpdate();
    }
    private setEasing = (name: any, value: string) => {
        const { scene } = this.props;

        scene && scene.setEasing(value);
        this.props.onUpdate();
    }
    private setIterationCount = (name: any, value: string) => {
        const { scene } = this.props;

        scene && scene.setIterationCount(value === "infinite" ? value : parseFloat(value));
        this.props.onUpdate();
    }
    private setDirection = (name: any, value: DirectionType) => {
        const { scene } = this.props;

        scene && scene.setDirection(value);
        this.props.onUpdate();
    }
    private setFillMode = (name: any, value: FillModeType) => {
        const { scene } = this.props;

        scene && scene.setFillMode(value);
        this.props.onUpdate();
    }
    private setDuration = (name: any, value: FillModeType) => {
        const { scene } = this.props;
        const time = parseFloat(value);

        if (time > 0 && scene) {
            scene.setDuration(time);
        }
        this.props.onUpdate();
    }
    private setLastFrame = (name: any, value: string) => {
        const { scene } = this.props;
        const time = parseFloat(value);

        if (scene && scene.getDuration() < time) {
            (scene as SceneItem).newFrame(time);
        }
        this.props.onUpdate();
    }
}
