import * as React from "react";
import LabelBox from "../../Inputs/LabelBox";
import TabInputBox from "../../Inputs/TabInputBox";
import TextBox from "../../Inputs/TextBox";
import "../Folder/Folder.css";
import File from "../Folder/File";

export default class Property extends File<{
    onChange: (scope: string[], value: any) => any
}> {
    public render() {
        const {
            name,
            value,
        } = this.props;
        return <><LabelBox type={"third"} label={name}></LabelBox>
            <TabInputBox type={"twothird"} input={TextBox} value={value}
                updateValue={true}
                onChange={this.onChange}
            ></TabInputBox></>;
    }
    public onChange = (v: any) => {
        const {
            onChange,
            scope,
        } = this.props;

        onChange(scope, v);
    }
}
