import * as React from "react";
import Icon from "./Icon";

export default class TransformIcon extends Icon {
    public static id = "Transform";
    public renderIcon() {
        return (
            <svg viewBox="0 0 80 80">
                <rect x="20" y="20" width="40" height="40" stroke="#fff" strokeWidth="3" fill="rgba(255, 255, 255, 0.5)"></rect>
                <rect x="15" y="15" width="10" height="10" fill="#fff"></rect>
                <rect x="35" y="15" width="10" height="10" fill="#fff"></rect>
                <rect x="55" y="15" width="10" height="10" fill="#fff"></rect>

                <rect x="15" y="35" width="10" height="10" fill="#fff"></rect>
                <rect x="55" y="35" width="10" height="10" fill="#fff"></rect>


                <rect x="15" y="55" width="10" height="10" fill="#fff"></rect>
                <rect x="35" y="55" width="10" height="10" fill="#fff"></rect>
                <rect x="55" y="55" width="10" height="10" fill="#fff"></rect>
            </svg>
        );
    }
}
