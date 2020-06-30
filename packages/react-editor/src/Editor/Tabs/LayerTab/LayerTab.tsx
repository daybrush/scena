import * as React from "react";
import Tab from "../Tab";
import { prefix } from "../../../utils";
import EventBus from "../../EventBus";
import MoveableData from "../../MoveableData";

import Folder from "../Folder/Folder";
import Property from "../FrameTab/Property";
import File from "../Folder/File";
import { Frame } from "scenejs";
import { ElementInfo } from "../../Viewport/Viewport";
import Layer from "./Layer";

export default class LayerTab extends Tab {
    public static id = "Layers";
    public title = "Layers";
    public state: {
        infos: ElementInfo[],
        selected: string[] | null,
    } = {
        infos: [],
        selected: null,
    };
    public renderTab() {
        const { infos, selected } = this.state;

        return <Folder
            scope={[]} name="" properties={infos}
            getId={(v: ElementInfo) => v.id}
            getName={(v: ElementInfo) => v.name}
            getChildren={() => false}
            selected={selected}
            onSelect={this.onSelect}
            FileComponent={this.renderFile} />;
    }
    public renderFile= ({ name, fullName, scope, value }: File["props"]) => {
        return <Layer name={name} fullName={fullName} scope={scope} value={value}></Layer>;
    }
    public componentDidMount() {
        EventBus.on("setTargets", this.setTargets as any);
        EventBus.on("changeLayers", this.changeLayers as any);
    }
    public componentWillUnmount() {
        EventBus.off("setTargets", this.setTargets as any);
        EventBus.off("changeLayers", this.changeLayers as any);
    }

    private onSelect = (selected: string[]) => {
        EventBus.requestTrigger("selectLayers", {
            selected,
        })
    }
    private changeLayers = ({ infos }: { infos: ElementInfo[] }) => {
        this.setState({
            infos,
        });
    }
    private setTargets = ({ targets }: { targets: HTMLElement[] }) => {
        this.setState({
            selected: targets.map(target => target.getAttribute("data-moveable-id")!),
        });
    }
}
