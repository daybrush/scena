import * as React from "react";
import Icon from "./Icon";
import Memory from "../utils/Memory";

export default class RoundRectIcon extends Icon {
    public static id = "RoundRect";
    public static maker = (memory: Memory) => ({
        tag: "div",
        attrs: {},
        style: {
            "background-color": memory.get("background-color"),
            "border-radius": "10px",
        },
    });
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <path d="M26.5,21.5 h20 a10,10 0 0 1 10,10 v10 a10,10 0 0 1 -10,10 h-20 a10,10 0 0 1 -10,-10 v-10 a10,10 0 0 1 10,-10 z"
                    fill="#555" strokeLinejoin="round" strokeWidth="3" stroke="#fff"></path>
            </svg>
        );
    }
}
