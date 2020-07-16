import * as React from "react";
import Tab from "../Tab";
import "./FontTab.css";
import { prefix } from "../../utils/utils";
import TabInputBox from "../../Inputs/TabInputBox";
import SelectBox from "../../Inputs/SelectBox";
import TextBox from "../../Inputs/TextBox";

const FONT_FAMILY_PROPS = {
    options: ["sans-serif"],
};
const TEXT_ALIGN_PROPS = {
    options: ["left", "center", "right", "justify"],
};
const FONT_STYLE_PROPS = {
    options: ["normal", "italic", "blique"],
};
const FONT_WEIGHT_PROPS = {
    options: ["100", "200", "300", "normal", "500", "600", "bold", "800"],
};
const TEXT_DECORATION_PROPS = {
    options: ["none", "underline", "overline", "line-through"],
}
export default class FontTab extends Tab {
    public static id = "Font";
    public title = "Font";
    public renderTab() {
        const [
            family,
            size,
            align,
            style,
            weight,
            decoration,
        ] = this.moveableData.getProperties([
            ["font-family"],
            ["font-size"],
            ["text-align"],
            ["font-style"],
            ["font-weight"],
            ["text-decoration"],
        ], [
            "sans-serif",
            "14px",
            "left",
            "normal",
            "normal",
            "none",
        ]);

        return <div className={prefix("font-tab")}>
            <TabInputBox type={"half"} label="family" input={SelectBox}
                props={FONT_FAMILY_PROPS}
                value={family} updateValue={true} onChange={this.onChangeFamily} />
            <TabInputBox type={"half"} label="size" input={TextBox}
                value={size}
                updateValue={true}
                onChange={this.onChangeSize} />
            <TabInputBox type={"half"} label="align" input={SelectBox}
                props={TEXT_ALIGN_PROPS}
                value={align} updateValue={true}
                onChange={this.onChangeAlign} />
            <TabInputBox type={"half"} label="style" input={SelectBox}
                props={FONT_STYLE_PROPS}
                value={style} updateValue={true}
                onChange={this.onChangeStyle} />
            <TabInputBox type={"half"} label="weight" input={SelectBox}
                props={FONT_WEIGHT_PROPS}
                value={weight} updateValue={true}
                onChange={this.onChangeWeight} />
            <TabInputBox type={"half"} label="decoration" input={SelectBox}
                props={TEXT_DECORATION_PROPS}
                value={decoration} updateValue={true}
                onChange={this.onChangeDecoration} />
        </div>;
    }
    public componentDidMount() {
        this.addEvent("render", this.onRender as any);
        this.addEvent("setSelectedTargets", this.setTargets as any);
    }
    private onChangeSize = (v: any) => {
        this.changeProperty("font-size", v);
    }
    private onChangeAlign = (v: any) => {
        this.changeProperty("text-align", v);
    }
    private onChangeFamily = (v: any) => {
        this.changeProperty("font-family", v);
    }
    private onChangeStyle = (v: any) => {
        this.changeProperty("font-style", v);
    }
    private onChangeWeight = (v: any) => {
        this.changeProperty("font-weight", v);
    }
    private onChangeDecoration = (v: any) => {
        this.changeProperty("text-decoration", v);
    }
    private onRender = () => {
        this.forceUpdate();
    }
    private setTargets = () => {
        this.forceUpdate();
    }
    private changeProperty(name: string, v: any) {
        this.memory.set(name, v);
        this.editor.setProperty([name], v, true);
    }
}
