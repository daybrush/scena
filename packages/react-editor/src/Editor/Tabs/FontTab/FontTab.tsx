import * as React from "react";
import Tab from "../Tab";
import "./FontTab.css";
import { prefix } from "../../utils/utils";

export default class AlignTab extends Tab {
    public static id = "Font";
    public title = "Font";
    public renderTab() {
        return <div className={prefix("font-tab")}>
            font-family,
            13pt
            bold italic
            oblique
            align
            letter spacing
        </div>;
    }
}
