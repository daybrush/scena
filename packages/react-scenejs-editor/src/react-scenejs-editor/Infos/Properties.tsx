import * as React from "react";
import Scene, { SceneItem } from "scenejs";
import { prefix, isSceneItem } from "../../utils";
import { IObject } from "@daybrush/utils";
import PureProps from "react-pure-props";
import Group from "./Group";

export default class Properties extends PureProps<{
    scene: Scene | SceneItem,
    properties: IObject<any>,
    onUpdate: () => void,
}> {
    public render() {
        const { scene, properties } = this.props;
        return (
            <Group
                name="properties"
                scope= ""
                enable={isSceneItem(scene)}
                properties={properties}
                setCallback={this.setCallback} />
        );
    }
    public setCallback = (fullName: string, value: any) => {
        const scene = this.props.scene;
        const names = fullName.split("///");

        scene.set(scene.getIterationTime(), ...names, value);
        this.props.onUpdate();
    }
}
