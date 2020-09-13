import * as React from "react";
import Icon from "./Icon";

export default class AlignIcon extends Icon {
    public static id = "Align";
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <rect x="15" y="16" width="36" height="6" rx="3" fill="#fff"></rect>
                <rect x="15" y="35" width="26" height="6" rx="3" fill="#fff"></rect>
                <rect x="15" y="54" width="46" height="6" rx="3" fill="#fff"></rect>
            </svg>
        );
    }
}
