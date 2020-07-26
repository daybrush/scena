import * as React from "react";
import Icon from "./Icon";
import Memory from "../utils/Memory";

export default class TextIcon extends Icon {
    public static id = "Text";
    public keys = ["t"];
    public static maker = (memory: Memory) => ({
        tag: "div",
        attrs: {
            contenteditable: true,
        },
        style: {
            color: memory.get("color"),
        },
    });
    public static makeThen = (target: HTMLElement | SVGElement) => {
        target.focus();
    };
    public renderIcon() {
        return (
            <svg viewBox="0 0 80 80">
                <g transform="matrix(0.987601,0,0,0.987601,-1.97306,0.554734)">
                    <path
                        // tslint:disable-next-line: max-line-length
                        d="M64.286,17.81L20.714,17.81L20.714,29.56L29.214,23L39.262,23L39.262,55.476L27.77,61.262L27.77,62.071L57.23,62.071L57.23,61.262L45.738,55.476L45.738,23L55.786,23L64.286,29.56L64.286,17.81Z"
                        style={{ fill: "white" }} />
                </g>
            </svg>
        );
    }
}
