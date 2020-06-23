import * as React from "react";
import Icon from "./Icon";

export default class CropIcon extends Icon {
    public static id = "Crop";
    public renderIcon() {
        return (
            <svg viewBox="0 0 80 80">
                <path
                    // tslint:disable-next-line: max-line-length
                    d="M25,10L25,50L65,50   M10,25L50,25L50,65"
                    style={{ stroke: "white", strokeWidth: 5, fill: "none" }} />
            </svg>
        );
    }
}
