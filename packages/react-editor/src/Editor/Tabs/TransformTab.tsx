import * as React from "react";
import Tab from "./Tab";
import { prefix } from "../../utils";
import { OnRender } from "react-moveable";
import EventBus from "../EventBus";
import NumberBox from "../Inputs/NumberBox";
import TabInputBox from "../Inputs/TabInputBox";

const inputProps = {
    step: 1,
};

export default class TransformTab extends Tab {
    public static id = "Transform";
    public title = "Transform";
    public xInput = React.createRef<TabInputBox>();
    public yInput = React.createRef<TabInputBox>();
    public wInput = React.createRef<TabInputBox>();
    public hInput = React.createRef<TabInputBox>();
    public renderTab() {

        return <div className={prefix("transform-tab")}>
            <div className={prefix("tab-line")}>
                <TabInputBox ref={this.xInput} type={"half"} label="X" input={NumberBox} onChange={this.onChangePos} />
                <TabInputBox ref={this.yInput} type={"half"} label="Y" input={NumberBox} onChange={this.onChangePos} />
            </div>
            <div className={prefix("tab-line")}>
                <TabInputBox ref={this.wInput} type={"half"}
                    label="W" input={NumberBox} inputProps={inputProps} onChange={this.onChangeSize} />
                <TabInputBox ref={this.hInput} type={"half"}
                    label="H" input={NumberBox} inputProps={inputProps} onChange={this.onChangeSize} />
            </div>
        </div>;
    }
    public componentDidMount() {
        EventBus.on("render", this.onRender as any);
    }
    public componentWillUnmount() {
        EventBus.off("render", this.onRender as any);
    }
    public onChangePos = () => {
        const x = parseFloat(this.xInput.current!.getValue());
        const y = parseFloat(this.xInput.current!.getValue());

        this.props.moveable.current!.request("draggable", { x, y, isInstant: true });
    }
    public onChangeSize = () => {
        const width = parseFloat(this.wInput.current!.getValue());
        const height = parseFloat(this.hInput.current!.getValue());

        this.props.moveable.current!.request("resizable", { offsetWidth: width, offsetHeight: height, isInstant: true });
    }
    public onRender = (e: OnRender) => {
        const moveable = this.props.moveable.current!;

        const rect = moveable.getRect();

        this.xInput.current!.setValue(rect.left);
        this.yInput.current!.setValue(rect.top);
        this.wInput.current!.setValue(rect.width);
        this.hInput.current!.setValue(rect.height);
    }
}
