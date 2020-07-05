import * as React from "react";
import Tab from "../Tab";
import { prefix } from "../../utils/utils";
import EventBus from "../../utils/EventBus";
import { getSelectedFrames, renderFrames } from "../../utils/MoveableData";

import Folder from "../Folder/Folder";
import Property from "./Property";
import File from "../Folder/File";
import "./FrameTab.css";

export default class FrameTab extends Tab {
    public static id = "Frame";
    public title = "Frame";
    public state: {
        selected: string[] | null,
    } = {
        selected: null,
    };
    public renderTab() {
        const {
            selected,
        } = this.state;

        const frame = getSelectedFrames()[0];

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
    private setTargets = () => {
        const state = this.state;

        state.selected = null;
        this.forceUpdate();
    }
}
