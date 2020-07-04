import * as React from "react";
import Tab from "../Tab";
import { prefix } from "../../../utils";
import ColorBox from "../../Inputs/ColorBox";
import TabInputBox from "../../Inputs/TabInputBox";
import EventBus from "../../EventBus";
import Memory from "../../Memory";
import MoveableData, { getSelectedFrames, renderFrames } from "../../MoveableData";

export default class ColorTab extends Tab {
    public static id = "Colors";
    public title = "Colors";

    public state = {
        targets: [],
        backgroundColor: Memory.get("background-color"),
        color: Memory.get("color"),
    };
    public renderTab() {
        const {
            color,
            backgroundColor,
        } = this.state;
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
        this.setState({
            backgroundColor: v,
        });
        getSelectedFrames().forEach(frame => {
            frame.set("background-color", v);
        });
        renderFrames();
    }
    public onChangeTextColor = (v: string) => {
        Memory.set("color", v);
        this.setState({
            color: v,
        });
        getSelectedFrames().forEach(frame => {
            frame.set("color", v);
        });
        renderFrames();
    }
    private onRender = () => {
        const frames = getSelectedFrames();

        if (!frames.length) {
            this.setState({
                backgroundColor: Memory.get("background-color"),
                color: Memory.get("color"),
            });
            return;
        }
        const backgroundColors = frames.map(frame => frame.get("background-color"));
        const colors = frames.map(frame => frame.get("color"));

        this.setState({
            backgroundColor: backgroundColors.filter(color => color)[0] || "transparent",
            color: colors.filter(color => color)[0] || "#333",
        });
    }
}
