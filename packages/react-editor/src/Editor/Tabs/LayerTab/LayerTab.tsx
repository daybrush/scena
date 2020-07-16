import * as React from "react";
import Tab from "../Tab";
import Folder from "../Folder/Folder";
import File from "../Folder/File";
import { ElementInfo } from "../../Viewport/Viewport";
import Layer from "./Layer";

export default class LayerTab extends Tab {
    public static id = "Layers";
    public title = "Layers";

    public renderTab() {
        const infos = this.editor.getViewportInfos();
        const selected = this.moveableData.getSelectedTargets().map(target => target.getAttribute("data-scena-element-id")!)

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
        this.addEvent("setSelectedTargets", this.setSelectedTargets);
    }

    private onSelect = (selected: string[]) => {
        this.eventBus.requestTrigger("selectLayers", {
            selected,
        })
    }
    private setSelectedTargets = () => {
        this.forceUpdate();
    }
}
