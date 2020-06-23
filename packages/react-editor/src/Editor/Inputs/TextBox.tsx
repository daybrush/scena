import * as React from "react";
import { getKey } from "keycon";
import Input from "./Input";
import { isUndefined, IObject } from "@daybrush/utils";

export default class TextBox extends Input {
    protected inputAttributes: IObject<any> = {};
    public render() {
        return (
            <input ref={this.input as any}
                {...this.inputAttributes}
                {...this.props.inputProps}
                onInput={this.onInput}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp} />
        );
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
