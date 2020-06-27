import * as React from "react";
import Tab from "./Tab";
import { prefix } from "../../utils";
import EventBus from "../EventBus";
import MoveableData from "../MoveableData";
import { Frame } from "scenejs";
import { IObject, isObject } from "@daybrush/utils";
import LabelBox from "../Inputs/LabelBox";
import TabInputBox from "../Inputs/TabInputBox";
import TextBox from "../Inputs/TextBox";
import Folder from "./Folder";

export default class FrameTab extends Tab {
    public static id = "Frame";
    public title = "Frame";
    public state = {
        target: null,
    };
    public renderTab() {
        const frame = MoveableData.getFrame(this.state.target as any);


        if (!frame) {
            return;
        }
        return <div className={prefix("frame-tab")}>
            <Folder name="" properties={frame.get()} scope={[]} />
        </div>;
    }
    public componentDidMount() {
        EventBus.on("render", this.onRender as any);
        EventBus.on("setTargets", this.setTargets as any);
    }
    public componentWillUnmount() {
        EventBus.off("render", this.onRender as any);
        EventBus.off("setTargets", this.setTargets as any);
    }
    public onRender = () => {
        this.forceUpdate();
    }
    public setTargets = ({ targets }: any) => {
        const length = targets.length;

        this.setState({
            target: length === 1 ? targets[0] : null,
        });
    }
}
