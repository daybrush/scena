import * as React from "react";
import Tab from "../Tab";
import { prefix, getId } from "../../utils/utils";
import "./AlignTab.css";
import Align from "./Align";
import MoveableGroup from "react-moveable/declaration/MoveableGroup";

const TYPES = ["vertical", "horizontal"] as const;
const DIRECTIONS = ["start", "center", "end"] as const;


function getDirectionPos(
    type: "horizontal" | "vertical", direction: "start" | "center" | "end", rect: { left: number, top: number, width: number, height: number }): number {
    let size: number;
    let start: number;
    if (type === "horizontal") {
        size = rect.height;
        start = rect.top;
    } else {
        size = rect.width;
        start = rect.left;
    }
    if (direction === "start") {
        return start;
    }
    if (direction === "center") {
        return start + size / 2;
    }
    return start + size;
}
export default class AlignTab extends Tab {
    public static id = "Align";
    public title = "Align";
    public renderTab() {
        return <div className={prefix("align-tab")}>
            {TYPES.map(type => {
                return DIRECTIONS.map(direction => {
                    return <Align key={`${type}-${direction}`}
                        type={type} direction={direction} onClick={this.onClick}></Align>
                });
            })}
        </div>;
    }
    public onClick = (type: "horizontal" | "vertical", direction: "start" | "center" | "end") => {
        const moveable = this.getMoveable();

        if (!moveable.moveable) {
            return;
        }
        const moveables = (moveable.moveable as MoveableGroup).moveables;
        const rect = moveable.getRect();
        const pos = getDirectionPos(type, direction, rect);

        if (moveables) {
            // Group
            const infos = moveables.map(child => {
                const target = child.state.target!;
                const frame = this.moveableData.getFrame(target);

                if (frame) {
                    const prev = frame.get();
                    const subRect = child.getRect();
                    const subPos = getDirectionPos(type, direction, subRect);
                    const delta = pos - subPos;

                    const translate = frame.get("transform", "translate").split(",").map((v: string) => parseFloat(v));


                    translate[type === "horizontal" ? 1 : 0] += delta;

                    frame.set("transform", "translate", translate.map((t: number) => `${t}px`).join(", "));

                    return { id: getId(target), prev, next: frame.get() };
                }
                return false;
            }).filter(target => target);


            this.historyManager.addAction("renders", {
                infos,
            });
            this.moveableData.renderFrames();
            moveable.updateRect();
        } else {
            const viewportRect = {
                width: 400,
                height: 600,
                left: 0,
                top: 0,
            }
            const viewportPos = getDirectionPos(type, direction, viewportRect);
            const delta = pos - viewportPos;

            moveable.request("draggable", { [type === "horizontal" ? "deltaY" : "deltaX"]: -delta }, true);
        }
    }
}
