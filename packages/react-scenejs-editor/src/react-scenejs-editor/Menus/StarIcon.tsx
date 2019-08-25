import React from "react";
import { star } from "shape-svg";
import ShapeIcon from "./ShapeIcon";

export default class StarIcon extends ShapeIcon {
    public componentDidMount() {
        this.getElement().appendChild(star({
           width: 40, side: 5, height: 40, left: 15, right: 15,
           top: 15.4, bottom: 15.4, fill: "#555", stroke: "#fff", strokeWidth: 3,
        }));
    }
}
