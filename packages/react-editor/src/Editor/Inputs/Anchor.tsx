import * as React from "react";
import Input from "./Input";
import { IObject } from "@daybrush/utils";
import { prefix } from "../utils/utils";
import "./Anchor.css";


const HORIZONTAL_DIRECTIONS = ["w", "", "e"];
const VERTICAL_DIRECTIONS = ["n", "", "s"];
export default class Anchor extends Input {
    protected inputAttributes: IObject<any> = {};
    public state = {
        origin: [50, 50],
    }
    public render() {
        const origin = this.state.origin.map(v => Math.min(100, Math.max(0, Math.round(v / 50) * 50)));
        return (
            <div className={prefix("anchor-input")}>
                <div className={prefix("anchor-input-background")} onClick={this.onClick}>
                    {VERTICAL_DIRECTIONS.map((v, i) => {
                        return HORIZONTAL_DIRECTIONS.map((h, j) => {
                            const classNames: string[] = [];
                            if (v) {
                                classNames.push(`anchor-${v}`);
                            }
                            if (h) {
                                classNames.push(`anchor-${h}`);
                            }
                            if (origin[0] === j * 50 && origin[1] === i * 50) {
                                classNames.push(`anchor-selected`);
                            }
                            return <div key={`dir${h}-${v}`}
                                className={prefix("anchor-control", ...classNames)} data-anchor-index={`${j},${i}`}></div>;
                        })
                    })}
                </div>
            </div>
        );
    }
    public onClick = (e: any) => {
        const target = e.target as HTMLElement;
        const indexes = target.getAttribute("data-anchor-index");

        if (!indexes) {
            return;
        }
        const origin = indexes.split(",").map(v => parseFloat(v) * 50);
        this.props.onChange(origin);
    }
    public setValue(v: string) {
        this.setState({
            origin: v,
        });
    }
    public getValue() {
        return this.state.origin;
    }
}
