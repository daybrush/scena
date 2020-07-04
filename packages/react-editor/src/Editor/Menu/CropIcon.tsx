import * as React from "react";
import Icon from "./Icon";
import MoveableData, { getSelectedFrames, renderFrames, getTargets } from "../MoveableData";
import Memory from "../Memory";
import { splitBracket, camelize } from "@daybrush/utils";
import OvalIcon from "./OvalIcon";
import { prefix } from "../../utils";
import RectIcon from "./RectIcon";
import EventBus from "../EventBus";
import CircleIcon from "./CircleIcon";
import PolygonIcon from "./PolygonIcon";

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
    public renderSubIcons() {
        const frame = getSelectedFrames()[0];
        let cropType = Memory.get("crop") || "inset";

        if (frame) {
            const clipPath = frame.get("clip-path") || frame.get("clip");

            if (clipPath) {
                cropType = splitBracket(clipPath).prefix!;
            }
        }
        return [
            this.renderSubIcon(RectIcon, "inset", cropType === "inset"),
            this.renderSubIcon(RectIcon, "rect", cropType === "rect"),
            this.renderSubIcon(CircleIcon, "circle", cropType === "circle"),
            this.renderSubIcon(OvalIcon, "ellipse", cropType === "ellipse"),
            this.renderSubIcon(PolygonIcon, "polygon", cropType === "polygon"),
            // "Inset",
            // "Rect",
            // "Polygon",
            // "Circle",
            // "Ellipse",
        ];
    }
    public onSubSelect(id: string) {
        const frame = getSelectedFrames()[0];

        if (frame) {
            const clipPath = frame.get("clip-path") || frame.get("clip");

            if (clipPath) {
                const cropType = splitBracket(clipPath).prefix!;

                if (id !== cropType) {
                    frame.remove("clip-path");
                    frame.remove("clip");
                    const target = getTargets()[0];
                    target.style.removeProperty("clip");
                    target.style.removeProperty("clip-path");
                    renderFrames();
                }
            }
        }
        Memory.set("crop", id);

        EventBus.requestTrigger("update");

        this.forceUpdate();
    }
}
