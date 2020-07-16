import * as React from "react";
import Tab from "./Tab";
import { prefix } from "../utils/utils";
import NumberBox from "../Inputs/NumberBox";
import TabInputBox from "../Inputs/TabInputBox";
import Anchor from "../Inputs/Anchor";

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
    public oInput = React.createRef<TabInputBox>();
    public rInput = React.createRef<TabInputBox>();
    public renderTab() {

        return <div className={prefix("transform-tab")}>
            <div className={prefix("tab-line")}>
                <TabInputBox ref={this.oInput}
                    type={"half"} label="Anchor" input={Anchor} onChange={this.onChangeOrigin} />
                <TabInputBox ref={this.rInput}
                    type={"half"} label="Rotation" input={NumberBox} onChange={this.onChangeRotate} />
            </div>
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
        this.addEvent("render", this.onRender);
        this.addEvent("renderGroup", this.onRender);
        this.addEvent("setSelectedTargets", this.onRender);

        this.onRender();
    }
    public onChangeRotate = (v: any) => {
        const rotate = parseFloat(v);
        this.getMoveable().request("rotatable", { rotate, isInstant: true });
    }
    public onChangePos = () => {
        const x = parseFloat(this.xInput.current!.getValue());
        const y = parseFloat(this.yInput.current!.getValue());

        this.getMoveable().request("draggable", { x, y, isInstant: true });
    }
    public onChangeOrigin = (origin: number[]) => {
        const moveable = this.getMoveable();
        const rect = moveable.getRect();

        const ow = rect.offsetWidth * origin[0] / 100;
        const oh = rect.offsetHeight * origin[1] / 100;
        this.getMoveable().request("originDraggable", { origin: [ow, oh] }, true);
    }
    public onChangeSize = () => {
        const width = parseFloat(this.wInput.current!.getValue());
        const height = parseFloat(this.hInput.current!.getValue());

        this.getMoveable().request("resizable", { offsetWidth: width, offsetHeight: height, isInstant: true });
    }
    public onRender = () => {
        const moveable = this.getMoveable();

        const rect = moveable.getRect();

        this.xInput.current!.setValue(rect.left);
        this.yInput.current!.setValue(rect.top);
        this.wInput.current!.setValue(rect.offsetWidth);
        this.hInput.current!.setValue(rect.offsetHeight);
        this.rInput.current!.setValue(Math.round(rect.rotation));

        const origin = rect.transformOrigin;

        this.oInput.current!.setValue([
            origin[0] / rect.offsetWidth * 100,
            origin[1] / rect.offsetHeight * 100,
        ]);
    }
}
