import * as React from "react";
import Input from "./Input";
import { isUndefined, IObject } from "@daybrush/utils";
import { prefix } from "../utils/utils";
import styled from "react-css-styled";

const SelectElement = styled("select", `
{
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: block;
    width: 100%;
    height: 30px;
    padding: 5px;
    background: transparent;
    color: var(--scena-editor-color-main);
    font-weight: bold;
    background: var(--scena-editor-color-back1);
    border: 0;
    box-sizing: border-box;
    text-align: center;
}

`);
export default class SelectBox extends Input<{
    options: string[]
}, {}, HTMLSelectElement> {
    protected inputAttributes: IObject<any> = {};
    public render() {
        const options = this.props.options || [];
        return (
            <SelectElement ref={this.input}
                className={prefix("select")}
                {...this.inputAttributes}
                {...this.props.inputProps}
                onInput={this.onInput}>
                {options.map(value => (<option key={value} value={value}>{value}</option>))}
            </SelectElement>
        );
    }
    public getValue(): any {
        return this.getElement().value;
    }
    public setValue(value: any) {
        this.getElement().value = `${isUndefined(value) ? "" : value}`;
    }
    protected onInput = (e: any) => {
        const ev = e.nativeEvent || e;

        if (!isUndefined(ev.data)) {
            return;
        }
        // click (up / down)
        this.props.onChange(this.getValue());
    }
}
