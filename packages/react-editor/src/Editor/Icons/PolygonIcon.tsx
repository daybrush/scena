import * as React from "react";
import Icon from "./Icon";

export default class PolygonIcon extends Icon {
    public static id = "Polygon";
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <path d="M 20,15 L 10,35 L 20,55 L 35,45 L 40, 50 L 55,31 L 41,15 L 30, 25 Z"
                    fill="#555" strokeLinejoin="round" strokeWidth="3" stroke="#fff"></path>
            </svg>
        );
    }
}
