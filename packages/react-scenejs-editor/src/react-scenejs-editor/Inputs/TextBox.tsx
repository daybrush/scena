import * as React from "react";
import { getKey } from "keycon";
import Input from "./Input";
import { ref } from "framework-utils";

export default class TextBox extends Input<{
    onFocus?: () => void,
    onBlur?: () => void,
}> {
    public render() {
        const {
            onFocus,
            onBlur,
        } = this.props;

        return (
            <input ref={ref(this, "input")}
                onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} onFocus={onFocus} onBlur={onBlur} />
        );
    }
    protected onKeyDown = (e: any) => {
        e.stopPropagation();
    }
    protected onKeyUp = (e: any) => {
        const target = e.currentTarget as HTMLInputElement;

        e.stopPropagation();
        if (getKey(e.keyCode) === "enter") {
            this.props.setCallback(target.value);
        }
    }
}
