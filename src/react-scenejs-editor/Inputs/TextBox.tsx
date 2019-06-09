import * as React from "react";
import { getKey } from "keycon";
import Input from "./Input";
import { ref } from "../utils";

export default class TextBox extends Input {
    public render() {
        return (<input ref={ref(this, "input")} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}/>);
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
