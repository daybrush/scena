import React from "react";
import ElementComponent from "../../utils/ElementComponent";
import { poly } from "shape-svg";
import ShapeIcon from "./ShapeIcon";

export default class PolyIcon extends ShapeIcon {
    public componentDidMount() {
        this.getElement().appendChild(poly({
            width: 40, height: 30, left: 15, right: 15,
            top: 17.4, bottom: 17.4, fill: "#555", stroke: "#fff", strokeWidth: 3,
        }));
    }
}
