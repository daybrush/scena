import * as React from "react";
import Icon from "./Icon";

export default class FontIcon extends Icon {
    public static id = "Font";
    public renderIcon() {
        return (
            <svg viewBox="0 0 80 80">
                <path
                    // tslint:disable-next-line: max-line-length
                    d="M64.286,17.81L20.714,17.81L20.714,29.56L29.214,23L39.262,23L39.262,55.476L27.77,61.262L27.77,62.071L57.23,62.071L57.23,61.262L45.738,55.476L45.738,23L55.786,23L64.286,29.56L64.286,17.81Z"
                    style={{ fill: "white" }} />
            </svg>
        );
    }
}
