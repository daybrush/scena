import * as React from "react";
import { prefix, ref } from "../utils";
import ElementComponent from "../utils/ElementComponent";
import TimeArea from "./TimeArea";
import Scene, { SceneItem } from "scenejs";

export default class ControlArea extends ElementComponent<{
    scene?: Scene | SceneItem,
    select: (property: string, time: number) => any,
    setTime: (time: number) => any,
    prev: () => any,
    next: () => any,
    togglePlay: () => any,
}, {
    isPlay: boolean,
}> {
    public timeArea!: TimeArea;
    public state = {
        isPlay: false,
    };
    public render() {
        return (
            <div className={prefix("control-area header-area")}>
                <div className={prefix("properties-area")} onClick={this.unselect}>
                    <div className={prefix("property")} />
                </div>
                <div className={prefix("values-area")}>
                    <div className={prefix("value")}></div>
                </div>
                <div className={prefix("keyframes-area")}>
                    <div className={prefix("keyframes")}>
                        <TimeArea ref={ref(this, "timeArea")} setTime={this.props.setTime} />
                        <div className={prefix("play-control-area")}>
                            <div className={prefix("control prev")} onClick={this.props.prev} />
                            <div
                                className={prefix("control " + (this.state.isPlay ? "pause" : "play"))}
                                onClick={this.props.togglePlay} />
                            <div className={prefix("control next")} onClick={this.props.next} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    public componentDidMount() {
       this.initScene(this.props.scene);
    }
    public componentDidUpdate(prevProps: ControlArea["props"]) {
        if (prevProps.scene !== this.props.scene) {
            this.initScene(this.props.scene);
            this.releaseScene(prevProps.scene);
        }
    }
    public componentWillUnmount() {
        this.releaseScene(this.props.scene);
    }
    private initScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.on({
            play: this.play,
            paused: this.pause,
        });
    }
    private releaseScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.off("play", this.play);
        scene.off("paused", this.pause);
    }
    private play = () => {
        this.setState({ isPlay: true });
    }
    private pause = () => {
        this.setState({ isPlay: false });
    }
    private unselect = () => {
        this.props.select("", -1);
    }
}
