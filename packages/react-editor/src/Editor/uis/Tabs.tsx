import * as React from "react";
import { styled } from "react-css-styled";
import { prefix } from "../utils/utils";
import AlignTab from "./tabs/AlignTab";
import ColorTab from "./tabs/ColorTab";
import FrameTab from "./tabs/FrameTab";
import HistoryTab from "./tabs/HistoryTab";
import LayersTab from "./tabs/LayersTab";
import TransformTab from "./tabs/TransformTab";
import BorderTab from "./tabs/BorderTab";

const TabsElement = styled("div", `
{
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--scena-editor-color-background-tool);
  z-index: 10;
  transform: translateZ(1px);
  border-top: 1px solid var(--scena-editor-color-divider);
  box-sizing: border-box;
  padding: 0px 5px;
  overflow: auto;
}
.scena-tab {
    border-bottom: 1px solid var(--scena-editor-color-divider);
    padding: 5px 0px;
}
.scena-tab h2 {
    margin: 0;
    color: var(--scena-editor-color-text);
    font-weight: bold;
    font-size: 12px;
    padding: 3px 8px 8px;
}
`);


export function SplittedTab() {

}

export const TABS: Record<string, () => React.ReactElement> = {
    align: () => <div className={prefix("tab")}>
        <AlignTab />
    </div>,
    transform: () => <div className={prefix("tab")}>
        <h2>Transform</h2>
        <TransformTab />
    </div>,
    fill: () => <div className={prefix("tab")}>
        <h2>Fill</h2>
        <ColorTab id="background-color" property="background-color" />
    </div>,
    stroke: () => <div className={prefix("tab")}>
        <h2>Stroke</h2>
        <BorderTab />
        <ColorTab id="border-color" />
    </div>,
    layers: () => <div className={prefix("tab")}>
        <h2>Layers</h2>
        <LayersTab />
    </div>,
    frame: () => <div className={prefix("tab")}>
        <h2>Frame</h2>
        <FrameTab />
    </div>,
    history: () => <div className={prefix("tab")}>
        <h2>History</h2>
        <HistoryTab />
    </div>,
};

export interface TabsProps {
    tabs: string[];
}
export function Tabs(props: TabsProps) {
    return <TabsElement>
        {props.tabs.map(tab => {
            const Element = TABS[tab];

            return <Element key={tab} />;
        })}
    </TabsElement>;
}
