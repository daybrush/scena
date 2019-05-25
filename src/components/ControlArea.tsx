import * as React from "react";
import { prefix, ref } from "../utils";
import ElementComponent from "./ElementComponent";

export default class ControlArea extends ElementComponent {
    public timeAreaElement: HTMLInputElement;
    public render() {
        return (
            <div className={prefix("control-area header-area")}>
                <div className={prefix("properties-area")}>
                    <div className={prefix("property")} />
                </div>
                <div className={prefix("values-area")}>
                    <div className={prefix("value")} />
                </div>
                <div className={prefix("keyframes-area")}>
                    <div className={prefix("keyframes")}>
                        <input className={prefix("time-area")} ref={ref(this, "timeAreaElement")}/>
                        <div className={prefix("play-control-area")}>
                            <div className={prefix("control prev")} />
                            <div className={prefix("control play")} />
                            <div className={prefix("control next")} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
