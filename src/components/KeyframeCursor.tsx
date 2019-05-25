import * as React from "react";
import ElementComponent from "./ElementComponent";
import { ref, prefix } from "../utils";

export default class KeyframeCursor extends ElementComponent {
    public render() {
        return <div
            className={prefix("keyframe-cursor")}
            ref={ref(this, "cursor")} />;
    }
}
