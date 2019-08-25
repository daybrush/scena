import * as React from "react";
import Input from "./Input";
import { prefix } from "../../utils";
import { ref } from "framework-utils";

export default class SelectBox extends Input<{
    options: string[],
}> {
    public render() {
        return (
            <div className={prefix("select")}>
                <select ref={ref(this, "input")} onInput={this.onInput}>{this.renderOptions()}</select>
            </div>
        );
    }
    private renderOptions() {
        return this.props.options.map(value => (<option key={value} value={value}>{value}</option>));
    }
    private onInput = () => {
        this.props.setCallback(this.input.value);
    }
}
