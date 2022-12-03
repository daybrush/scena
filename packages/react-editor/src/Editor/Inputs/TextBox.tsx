import * as React from "react";
import { getKey } from "keycon";
import Input from "./Input";
import { isUndefined, IObject } from "@daybrush/utils";
import { prefix } from "../utils/utils";
import styled from "react-css-styled";

const TextElement = styled("input", `
{
    position: relative;
    text-align: left;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: block;
    width: 100%;
    height: 30px;
    background: transparent;
    color: var(--scena-editor-color-main);
    font-weight: bold;
    background: none;
    border: 0;
    padding: 5px;
    box-sizing: border-box;
    background: var(--scena-editor-color-back1);
    font-size: 12px;
}
`);
export default class TextBox extends Input<{}, {}, HTMLInputElement> {
    protected inputAttributes: IObject<any> = {};
    public render() {
        return (
            <TextElement ref={this.input}
                className={prefix("input")}
                {...this.inputAttributes}
                {...this.props.inputProps}
                onInput={this.onInput}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp} />
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
        this.props.onChange(this.getElement().value);
    }

    protected onKeyDown = (e: any) => {
        e.stopPropagation();
    }
    protected onKeyUp = (e: any) => {
        const target = e.currentTarget as HTMLInputElement;

        e.stopPropagation();
        if (getKey(e.keyCode) === "enter") {
            this.props.onChange(target.value);
        }
    }
}
