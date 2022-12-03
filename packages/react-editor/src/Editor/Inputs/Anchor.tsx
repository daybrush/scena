import * as React from "react";
import Input from "./Input";
import { IObject } from "@daybrush/utils";
import { prefix } from "../utils/utils";
import styled from "react-css-styled";

const AnchorElement = styled("div", `
{
    position: relative;
    width: 30px;
    height: 35px;
    margin: auto;
    box-sizing: border-box;
}
.scena-anchor-input-background {
    position: relative;
    width: 30px;
    height: 30px;
    background: var(--scena-editor-color-back1);
}
.scena-anchor-control {
    position: absolute;
    width: 8px;
    height: 8px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    padding: 1px;
    box-sizing: border-box;
}
.scena-anchor-control:before {
    content: "";
    position: relative;
    display: block;
    background: var(--scena-editor-color-back5);
    width: 100%;
    height: 100%;
}
.scena-anchor-control.scena-anchor-selected {
    padding: 0px;
}
.scena-anchor-control.scena-anchor-selected:before {
    background: white;
}

.scena-anchor-control.scena-anchor-n {
    top: 0;
}
.scena-anchor-control.scena-anchor-s {
    top: 100%;
}
.scena-anchor-control.scena-anchor-w {
    left: 0;
}
.scena-anchor-control.scena-anchor-e {
    left: 100%;
}

`);



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
            <AnchorElement className={prefix("anchor-input")}>
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
            </AnchorElement>
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
