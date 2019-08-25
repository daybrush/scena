import React from "react";
import ElementComponent from "../../utils/ElementComponent";
import { prefix } from "../../utils";

export default class ShapeIcon extends ElementComponent {
    public render() {
        return (
            <div className={prefix("icon")} />
        );
    }
}
