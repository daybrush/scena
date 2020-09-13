import * as React from "react";
import Icon from "./Icon";

export default class ColorIcon extends Icon {
    public static id = "Colors";
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <ellipse fill="#e77" cx="36.5" cy="26" rx="17" ry="17"
                    strokeLinejoin="round"></ellipse>
                <ellipse fill="#7e7" cx="23" cy="50" rx="17" ry="17"
                    strokeLinejoin="round"></ellipse>
                <ellipse fill="#77e" cx="50" cy="50" rx="17" ry="17"
                    strokeLinejoin="round"></ellipse>
            </svg>
        );
    }
}
