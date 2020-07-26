import * as React from "react";
import Icon from "./Icon";
import Memory from "../utils/Memory";

export default class RectIcon extends Icon {
    public static id = "Rect";
    public static maker = (memory: Memory) => ({
        tag: "div",
        attrs: {},
        style: {
            "background-color": memory.get("background-color"),
        },
    });
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <path d="M16.5,21.5 h40 a0,0 0 0 1 0,0 v30 a0,0 0 0 1 -0,0 h-40 a0,0 0 0 1 -0,-0 v-30 a0,0 0 0 1 0,-0 z"
                    fill="#555" strokeLinejoin="round" strokeWidth="3" stroke="#fff"></path>
            </svg>
        );
    }
}
