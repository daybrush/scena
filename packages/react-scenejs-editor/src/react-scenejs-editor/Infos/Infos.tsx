import * as React from "react";
import { prefix, isSceneItem } from "../../utils";
import Options from "./Options";
import Properties from "./Properties";
import Scene, { SceneItem } from "scenejs";
import PureProps from "react-pure-props";
import { IObject } from "@daybrush/utils";
import styler from "react-css-styler";
import { INFOS_CSS } from "../../consts";
import { SelectEvent } from "../../types";
import { ref } from "framework-utils";

const InfosElement = styler("div", INFOS_CSS);

export default class Infos extends PureProps<{
    onUpdate: () => void,
}, {
    scene: Scene | SceneItem,
    name: string,
    properties: IObject<any>,
}> {
    public state = {
        scene: undefined!,
        name: "",
        properties: {},
    };
    public render() {
        const { onUpdate } = this.props;
        const { scene, properties } = this.state;

        return (
            <InfosElement className={prefix("infos")}>
                <Options
                    ref={ref(this, "options")}
                    scene={scene}
                    onUpdate={onUpdate} />
                <Properties
                    ref={ref(this, "properties")}
                    properties={properties}
                    scene={scene}
                    onUpdate={onUpdate} />
            </InfosElement>
        );
    }
    public select(e: Partial<SelectEvent>, values: IObject<any> = {}) {
        const scene = e.selectedItem!;
        const name = e.selectedName!;

        this.setState({
            scene,
            name,
            properties: this.getProperties(name, scene, values),
        });
    }
    public update(values: IObject<any>) {
        this.setState({
            properties: this.getProperties(this.state.name, this.state.scene, values),
        });
    }
    private getProperties(name: string, scene: Scene | SceneItem, values: IObject<any>) {
        const obj: IObject<any> = {};
        if (!scene || !isSceneItem(scene)) {
            return obj;
        }
        for (const property in values) {
            if ((property + "///").indexOf(name + "///") === 0) {
                const propertyLongName = property.replace(name + "///", "");

                if (!propertyLongName) {
                    continue;
                }
                const propertyNames = propertyLongName.split("///");
                let properties = obj;
                propertyNames.slice(0, -1).forEach(propertyName => {
                    !properties[propertyName] && (properties[propertyName] = {});
                    properties = properties[propertyName];
                });
                properties[propertyNames.slice(-1)[0]] = values[property];
            }
        }
        return obj;
    }
}
