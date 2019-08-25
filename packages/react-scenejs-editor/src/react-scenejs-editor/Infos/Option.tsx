import * as React from "react";
import { prefix } from "../../utils";
import SelectBox from "../Inputs/SelectBox";
import TextBox from "../Inputs/TextBox";
import NumberBox from "../Inputs/NumberBox";
import LabelBox from "../Inputs/LabelBox";
import UnitBox from "../Inputs/UnitBox";
import ColorBox from "../Inputs/ColorBox";

export default class Option extends React.Component<{
    type?: string,
    param?: any,
    name: string,
    value: any,
    setCallback: (name: any, value: any) => void,
}> {
    public render() {
        const {
            name,
        } = this.props;
        return (
            <div className={prefix("option")}>
                <div className={prefix("name")}>{name}</div>
                <div className={prefix("value")}>
                    {this.renderInput()}
                </div>
            </div>);
    }
    public renderInput() {
        const { type, value, param } = this.props;
        const setCallback = this.setCallback;

        switch (type) {
            case "unit":
                return (<UnitBox options={param} value={value} setCallback={setCallback} />);
            case "color":
                return (<ColorBox options={param} value={value} setCallback={setCallback} />);
            case "select":
                return (<SelectBox options={param} value={value} setCallback={setCallback} />);
            case "number":
                return (<NumberBox value={value} setCallback={setCallback} />);
            case "label":
                return (<LabelBox value={value} />);
            default:
                return (<TextBox value={value} setCallback={setCallback} />);
        }
    }
    private setCallback = (value: any) => {
        this.props.setCallback(this.props.name, value);
    }
}
