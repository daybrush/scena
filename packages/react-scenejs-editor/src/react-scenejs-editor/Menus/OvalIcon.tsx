import React from "react";
import { oval } from "shape-svg";
import ShapeIcon from "./ShapeIcon";

export default class OvalIcon extends ShapeIcon {
    public componentDidMount() {
        this.getElement().appendChild(oval({
            width: 40, side: 5, height: 30, left: 15, right: 15,
            top: 20, bottom: 20, fill: "#555", stroke: "#fff", strokeWidth: 3,
        }));
    }
}
