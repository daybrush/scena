import * as React from "react";
import Tab from "../Tab";
import { prefix } from "../../../utils";
import EventBus from "../../EventBus";
import MoveableData, { getSelectedFrames, renderFrames } from "../../MoveableData";

import Folder from "../Folder/Folder";
import Property from "./Property";
import File from "../Folder/File";
import { Frame } from "scenejs";

export default class FrameTab extends Tab {
    public static id = "Frame";
    public title = "Frame";
    public state: {
        frame: Frame | null,
        target: HTMLElement | null,
        selected: string[] | null,
    } = {
        target: null,
        frame: null,
        selected: null,
    };
    public renderTab() {
        const {
            selected,
            frame,
        } = this.state;

        if (!frame) {
            return;
        }
        return <div className={prefix("frame-tab")}>
            <Folder name="" properties={frame.get()} scope={[]} selected={selected}
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
    private renderProperty = ({ name, fullName, scope, value }: File["props"]) => {
        return <Property name={name} fullName={fullName} scope={scope} value={value} onChange={this.onChange}></Property>;
    }
    private onSelect = (selected: string[]) => {
        this.setState({
            selected,
        })
    }
    private onChange = (scope: string[], value: any) => {
        const frames = getSelectedFrames();

        if (!frames.length) {
            return;
        }
        getSelectedFrames().forEach(frame => {
            frame.set(...scope, value);
        });
        renderFrames();
        this.props.moveable.current!.updateRect();
        EventBus.requestTrigger("render");
    }
    private onRender = () => {
        this.forceUpdate();
    }
    private setTargets = ({ targets }: any) => {
        const length = targets.length;
        const target = length === 1 ? targets[0] : null;

        this.setState({
            frame: MoveableData.getFrame(target as any),
            selected: null,
        });
    }
}
