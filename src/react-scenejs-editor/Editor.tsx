import * as React from "react";
import Timeline, { SelectEvent } from "react-scenejs-timeline";
import Scene, { SceneItem } from "scenejs";
import { ref } from "./utils";
import { CSS } from "./consts";
import Infos from "./Infos/Infos";

let isExportCSS = false;

export default class Editor extends React.Component<{
    scene: Scene | SceneItem,
}> {
    private infos!: Infos;
    private timeline!: Timeline;
    private isExportCSS = false;
    constructor(props: any) {
        super(props);
        if (isExportCSS) {
            this.isExportCSS = true;
        }
    }
    public render() {
        return (
            <div className="scenejs-editor">
                {this.renderStyle()}
                <Infos
                    ref={ref(this, "infos")}
                    onUpdate={this.onUpdate}
                />
                <Timeline
                    ref={ref(this, "timeline")}
                    scene={this.props.scene}
                    style={{
                        maxHeight: "350px",
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                    onSelect={this.onSelect}
                />
            </div>);
    }
    public componentDidMount() {
        this.infos.select({
            selectedItem: this.props.scene,
            selectedName: "",
        });
        this.checkScene(undefined, this.props.scene);
    }
    public componentDidUpdate(prevProps: any) {
        this.checkScene(prevProps.scene, this.props.scene);
    }
    public componentWillUnmount() {
        if (this.isExportCSS) {
            isExportCSS = false;
        }
    }
    public update(isInit?: boolean) {
        this.timeline.update(isInit);
    }
    private checkScene(prevScene?: Scene | SceneItem, scene?: Scene | SceneItem) {
        if (prevScene !== scene) {
            this.releaseScene(prevScene);
            this.initScene(scene);
        }
    }
    private initScene(scene?: Scene | SceneItem) {
        if (!scene) {
          return;
        }
        scene.on("animate", this.onAnimate);
      }
    private releaseScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.off("animate", this.onAnimate);
      }
    private renderStyle() {
        if (!this.isExportCSS) {
            return <style>{CSS}</style>;
        } else {
            return null;
        }
    }
    private onAnimate = () => {
        this.infos.update(this.timeline.getValues());
    }
    private onSelect = (e: SelectEvent) => {
        (document.activeElement as HTMLInputElement).blur();

        this.infos.select(e, this.timeline.getValues());
    }
    private onUpdate = () => {
        this.update();
    }
}
