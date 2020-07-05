import * as React from "react";
import { getKey } from "keycon";
import Input from "./Input";
import { isUndefined, IObject } from "@daybrush/utils";
import { prefix } from "../utils/utils";

export default class TextBox extends Input<{}, {}, HTMLInputElement> {
    protected inputAttributes: IObject<any> = {};
    public render() {
        return (
            <input ref={this.input as any}
                className={prefix("input")}
                {...this.inputAttributes}
                {...this.props.inputProps}
                onInput={this.onInput}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp} />
        );
    }
    public getValue(): any {
        return this.input.current!.value;
    }
    public setValue(value: any) {
        this.input.current!.value = `${isUndefined(value) ? "" : value}`;
    }
    protected onInput = (e: any) => {
        const ev = e.nativeEvent || e;

        if (!isUndefined(ev.data)) {
            return;
        }
        // click (up / down)
        this.props.onChange(this.input.current!.value);
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
