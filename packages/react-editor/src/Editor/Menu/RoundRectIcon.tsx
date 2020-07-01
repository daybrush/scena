import * as React from "react";
import Icon from "./Icon";

export default class RoundRectIcon extends Icon {
    public static id = "RoundRect";
    public static maker = {
        tag: "div",
        props: {},
        style: {
            background: "#4af",
            "border-radius": "10px",
        },
    };
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <path d="M26.5,21.5 h20 a10,10 0 0 1 10,10 v10 a10,10 0 0 1 -10,10 h-20 a10,10 0 0 1 -10,-10 v-10 a10,10 0 0 1 10,-10 z"
                    fill="#555" stroke-linejoin="round" stroke-width="3" stroke="#fff"></path>
            </svg>
        );
    }
}
