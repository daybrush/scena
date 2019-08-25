import * as React from "react";
import Input from "./Input";
import { prefix } from "../../utils";
import TextBox from "./TextBox";
import { isUndefined } from "@daybrush/utils";
import { ref } from "framework-utils";

export default class NumberBox extends TextBox {
    public render() {
        return (
            <input
                ref={ref(this, "input")}
                type="number"
                min={0}
                step={0.1}
                pattern="[0-9.]*"
                onInput={this.onInput}
                onKeyDown={this.onKeyDown}
                onKeyUp={this.onKeyUp} />
        );
    }
    private onInput = (e: any) => {
        const ev = e.nativeEvent || e;

        if (isUndefined(ev.data)) {
            // click (up / down)
            this.props.setCallback(this.input.value);
        }
    }
}
