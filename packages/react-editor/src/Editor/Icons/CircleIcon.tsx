import * as React from "react";
import Icon from "./Icon";
import Memory from "../utils/Memory";

export default class CircleIcon extends Icon {
    public static id = "Circle";
    public static maker = (memory: Memory) => ({
        tag: "div",
        attrs: {},
        style: {
            "background-color": memory.get("background-color"),
            "border-radius": "50%",
        },
    });
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <ellipse fill="#555" cx="36.5" cy="36.5" rx="15" ry="15"
                    strokeLinejoin="round" strokeWidth="3" stroke="#fff"></ellipse></svg>
        );
    }
}
