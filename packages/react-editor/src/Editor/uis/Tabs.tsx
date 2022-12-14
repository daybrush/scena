import * as React from "react";
import styled from "react-css-styled";
import { prefix } from "../utils/utils";
import AlignTab from "./tabs/AlignTab";
import AppearanceTab from "./tabs/AppearanceTab";
import FrameTab from "./tabs/FrameTab";
import HistoryTab from "./tabs/HistoryTab";
import LayersTab from "./tabs/LayersTab";
import TransformTab from "./tabs/TransformTab";

const TabsElement = styled("div", `
{
  position: fixed;
  right: 0;
  top: var(--scena-editor-size-tools);
  bottom: 0;
  width: var(--scena-editor-size-tabs);
  background: var(--scena-editor-color-back2);
  z-index: 10;
  transform: translateZ(1px);
  border-top: 1px solid var(--scena-editor-color-back4);
  box-sizing: border-box;
  padding: 0px 5px;
  overflow: auto;
}
.scena-tab {
    border-bottom: 1px solid var(--scena-editor-color-back4);
    padding: 5px 0px;
}
.scena-tab h2 {
    margin: 0;
    color: white;
    font-weight: bold;
    font-size: 12px;
    padding: 3px 8px 8px;
}
`);


export function SplittedTab() {

}

export function Tabs() {
    return <TabsElement>
        <div className={prefix("tab")}>
            <AlignTab />
        </div>
        <div className={prefix("tab")}>
            <h2>Transform</h2>
            <TransformTab />
        </div>

        <div className={prefix("tab")}>
            <h2>Appearance</h2>
            <AppearanceTab />
        </div>
        <div className={prefix("tab")}>
            <h2>Layers</h2>
            <LayersTab />
        </div>
        <div className={prefix("tab")}>
            <h2>Frame</h2>
            <FrameTab />
        </div>
        <div className={prefix("tab")}>
            <h2>History</h2>
            <HistoryTab />
        </div>
    </TabsElement>;
}
