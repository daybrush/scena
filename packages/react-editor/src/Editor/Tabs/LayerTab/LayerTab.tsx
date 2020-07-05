import * as React from "react";
import Tab from "../Tab";
import EventBus from "../../utils/EventBus";

import Folder from "../Folder/Folder";
import File from "../Folder/File";
import { ElementInfo } from "../../Viewport/Viewport";
import Layer from "./Layer";
import Memory from "../../utils/Memory";
import { getTargets } from "../../utils/MoveableData";

export default class LayerTab extends Tab {
    public static id = "Layers";
    public title = "Layers";

    public renderTab() {
        const infos = Memory.get("viewportInfos") || [];
        const selected = getTargets().map(target => target.getAttribute("data-moveable-id")!)

        return <Folder
            scope={[]}
            name="" properties={infos}
            multiselect={true}
            getId={(v: ElementInfo) => v.id}
            getName={(v: ElementInfo) => v.name}
            getChildren={() => false}
            selected={selected}
            onSelect={this.onSelect}
            FileComponent={this.renderFile} />;
    }
    public renderFile = ({ name, fullName, scope, value }: File["props"]) => {
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
    private changeLayers = () => {
        this.forceUpdate();
    }
    private setTargets = () => {
        this.forceUpdate();
    }
}
