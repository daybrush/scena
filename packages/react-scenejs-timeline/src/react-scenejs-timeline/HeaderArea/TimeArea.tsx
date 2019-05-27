import * as React from "react";
import { prefix } from "../utils";
import ElementComponent from "../utils/ElementComponent";
import KeyController from "keycon";

export default class TimeArea extends ElementComponent<{
    setTime: (time: number) => any,
}, {}, HTMLInputElement> {
    public render() {
        return (
            <input className={prefix("time-area")}/>
        );
    }
    public componentDidMount() {
        new KeyController(this.getElement())
        .keydown(e => {
            !e.isToggle && e.inputEvent.stopPropagation();
        })
        .keyup(e => {
            !e.isToggle && e.inputEvent.stopPropagation();
        })
        .keyup("enter", e => {
            // go to time
            const value = (this.getElement() as HTMLInputElement).value;
            const result = /(\d+):(\d+):(\d+)/g.exec(value);

            if (!result) {
                return;
            }
            const minute = parseFloat(result[1]);
            const second = parseFloat(result[2]);
            const milisecond = parseFloat(`0.${result[3]}`);
            const time = minute * 60 + second + milisecond;

            this.props.setTime(time);
        });
    }
}
