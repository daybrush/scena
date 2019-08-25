import React from "react";
import { rect } from "shape-svg";
import ShapeIcon from "./ShapeIcon";

export default class RectIcon extends ShapeIcon {
    public componentDidMount() {
        this.getElement().appendChild(rect({
            width: 40, height: 30, left: 15, right: 15,
            top: 20, bottom: 20, fill: "#555", stroke: "#fff", strokeWidth: 3,
        }));
    }
}
