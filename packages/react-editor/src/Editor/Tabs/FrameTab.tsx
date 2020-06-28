import * as React from "react";
import Tab from "./Tab";
import { prefix } from "../../utils";
import EventBus from "../EventBus";
import MoveableData from "../MoveableData";

import TextBox from "../Inputs/TextBox";
import Folder from "./Folder/Folder";
import Property from "./Folder/Property";
import File from "./Folder/File";
import { Frame } from "scenejs";
import MoveableHelper from "moveable-helper";

export default class FrameTab extends Tab {
    public static id = "Frame";
    public title = "Frame";
    public state: {
        frame: Frame | null,
        target: HTMLElement | null,
        selectedProperty: string | null,
    } = {
        target: null,
        frame: null,
        selectedProperty: null,
    };
    public renderTab() {
        const {
            target,
            selectedProperty,
            frame,
        } = this.state;

        if (!frame) {
            return;
        }
        return <div className={prefix("frame-tab")}>
            <Folder name="" properties={frame.get()} scope={[]} selected={selectedProperty}
                onSelect={this.onSelect} FileComponent={this.renderProperty} />
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
    public onSelect = (selectName: string) => {
        this.setState({
            selectedProperty: selectName,
        })
    }
    public renderProperty = ({ name, fullName, scope, value }: File["props"]) => {
        return <Property name={name} fullName={fullName} scope={scope} value={value} onChange={this.onChange}></Property>;
    }
    public onChange = (scope: string[], value: any) => {
        const { target, frame } = this.state;

        if (!frame || !target) {
            return;
        }
        frame.set(...scope, value);

        MoveableData.render(target, frame);
        this.props.moveable.current!.updateRect();

        EventBus.requestTrigger("render");

    }
    public onRender = () => {
        this.forceUpdate();
    }
    public setTargets = ({ targets }: any) => {
        const length = targets.length;
        const target = length === 1 ? targets[0] : null;
        this.setState({
            target,
            frame: MoveableData.getFrame(target as any),
            selectedProperty: null,
        });
    }
}
