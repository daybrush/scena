import * as React from "react";
import Icon from "./Icon";

export default class OvalIcon extends Icon {
    public static id = "Oval";
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <ellipse fill="#555" cx="36.5" cy="36.5" rx="20" ry="15"
                    stroke-linejoin="round" stroke-width="3" stroke="#fff"></ellipse></svg>
        );
    }
}
