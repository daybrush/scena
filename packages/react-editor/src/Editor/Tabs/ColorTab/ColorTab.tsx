import * as React from "react";
import Tab from "../Tab";
import { prefix } from "../../utils/utils";
import ColorBox from "../../Inputs/ColorBox";
import TabInputBox from "../../Inputs/TabInputBox";
import EventBus from "../../utils/EventBus";
import Memory from "../../utils/Memory";
import { getSelectedFrames, renderFrames } from "../../utils/MoveableData";

export default class ColorTab extends Tab {
    public static id = "Colors";
    public title = "Colors";

    public renderTab() {
        const frames = getSelectedFrames();
        let backgroundColor = Memory.get("background-color");
        let color = Memory.get("color");

        if (frames.length) {
            const backgroundColors = frames.map(frame => frame.get("background-color"));
            const colors = frames.map(frame => frame.get("color"));

            backgroundColor = backgroundColors.filter(color => color)[0] || "transparent";
            color = colors.filter(color => color)[0] || "#333";
        }

        return <div className={prefix("current-tab")}>
            <TabInputBox type={"full"}
                label="Background Color"
                input={ColorBox}
                value={backgroundColor}
                updateValue={true}
                onChange={this.onChangeBackgroundColor} />
            <TabInputBox type={"full"}
                label="Text Color"
                input={ColorBox}
                value={color}
                updateValue={true}
                onChange={this.onChangeTextColor} />
        </div>;
    }
    public componentDidMount() {
        EventBus.on("render", this.onRender as any);
        EventBus.on("setTargets", this.onRender as any);
    }
    public componentWillUnmount() {
        EventBus.off("render", this.onRender as any);
        EventBus.off("setTargets", this.onRender as any);
    }
    public onChangeBackgroundColor = (v: string) => {
        Memory.set("background-color", v);
        getSelectedFrames().forEach(frame => {
            frame.set("background-color", v);
        });
        renderFrames();
        this.forceUpdate();
    }
    public onChangeTextColor = (v: string) => {
        Memory.set("color", v);
        getSelectedFrames().forEach(frame => {
            frame.set("color", v);
        });
        renderFrames();
        this.forceUpdate();
    }
    private onRender = () => {
        this.forceUpdate();
    }
}
