import * as React from "react";
import { IObject } from "@daybrush/utils";
import Input from "./Input";
import { prefix } from "../utils/utils";
import styled from "react-css-styled";


const TabInputElement = styled("div", `
{
    position: relative;
    box-sizing: border-box;
    padding: 2px;
    display: inline-block;
    vertical-align: top;
}
h3, h4 {
    color: white;
    margin: 0;
    padding: 7px 5px;
    font-size: 12px;
    font-weight: bold;
    display: inline-block;
}
h4 {
    font-size: 11px;
}
:host.scena-full {
    width: 100%;
}
:host.scena-half {
    width: 50%;
}
:host.scena-third {
    width: 33%;
}
:host.scena-twothird {
    width: 66%;
}
:host.scena-half:nth-child(2n + 1) {
    padding-right: 5px;
}
:host.scena-half:nth-child(2n + 2) {
    padding-left: 5px;
}
`);

export default class TabInputBox extends React.PureComponent<{
    type: "half" | "full" | "third" | "twothird",
    onChange: (v: any) => any,
    input: typeof Input,
    label?: string,
    props?: IObject<any>,
    inputProps?: IObject<any>,
    value?: any;
    updateValue?: boolean;
}> {
    public input = React.createRef<Input>();
    public render() {
        const {
            label,
            type,
            props = {},
            inputProps = {},
            input: InputType,
            onChange,
            value,
            updateValue,
        } = this.props;

        return <TabInputElement className={prefix("tab-input", type)}>
            {label && <h3>{label}</h3>}
            <InputType ref={this.input} onChange={onChange}
                {...props}
                inputProps={inputProps} value={value} updateValue={updateValue}></InputType>
        </TabInputElement>;
    }
    public setValue(v: any) {
        this.input.current!.setValue(v);
    }
    public getValue() {
        return this.input.current!.getValue();
    }
}
