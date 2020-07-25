import * as React from "react";
import Tab from "../Tab";
import Folder from "../Folder/Folder";
import File from "../Folder/File";
import { ElementInfo } from "../../Viewport/Viewport";
import Layer from "./Layer";
import { getIds } from "../../utils/utils";

export default class LayerTab extends Tab {
    public static id = "Layers";
    public title = "Layers";

    public renderTab() {
        const infos = this.editor.getViewportInfos();
        const selected = getIds(this.moveableData.getSelectedTargets());

        return <Folder
            scope={[]}
            name="" properties={infos}
            multiselect={true}
            getId={(v: ElementInfo) => v.id}
            getFullId={id => id}
            getName={(v: ElementInfo) => v.name}
            getChildren={(v: ElementInfo) => v.children || []}
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
        console.log(selected);
        this.eventBus.requestTrigger("selectLayers", {
            selected,
        })
    }
    private setSelectedTargets = () => {
        this.forceUpdate();
    }
}
