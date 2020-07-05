import * as React from "react";
import Input from "./Input";
import { isUndefined, IObject } from "@daybrush/utils";
import { prefix } from "../utils/utils";

export default class SelectBox extends Input<{
    options: string[]
}, {}, HTMLSelectElement> {
    protected inputAttributes: IObject<any> = {};
    public render() {
        const options = this.props.options || [];
        return (
            <select ref={this.input as any}
                className={prefix("select")}
                {...this.inputAttributes}
                {...this.props.inputProps}
                onInput={this.onInput}>
                {options.map(value => (<option key={value} value={value}>{value}</option>))}
            </select>
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
}
