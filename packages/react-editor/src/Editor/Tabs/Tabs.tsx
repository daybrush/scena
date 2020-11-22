import * as React from "react";
import { prefix } from "../utils/utils";
import TransformTab from "./TransformTab";
import Tab from "./Tab";
import FrameTab from "./FrameTab/FrameTab";
import AlignTab from "./AlignTab/AlignTab";
import LayerTab from "./LayerTab/LayerTab";
import CurrentTab from "./ColorTab/ColorTab";
import FontTab from "./FontTab/FontTab";
import styled, { StyledElement } from "react-css-styled";

const TabsElement = styled("div", `
{
    position: absolute;
    right: 0;
    width: 40px;
    height: 100%;
    background: var(--back2);
    z-index: 10;
    transform: translateZ(10px);
    box-sizing: border-box;
    padding-top: 30px;
    transition: width ease 0.2s;
    text-align: left;
}
.scena-tab {
    position: relative;
    margin: 5px;
}
.scena-tab-icon {
    position: relative;
    position: relative;
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    word-break: break-all;
    padding: 5px;
    width: 30px;
    line-height: 20px;
    height: 30px;
    box-sizing: border-box;
    border-radius: 3px;
    text-align: left;
    overflow: hidden;

}
.scena-tab-icon * {
    pointer-events: none;
}

.scena-tab.scena-selected .scena-tab-icon {
    background: var(--mainColor);
}

.scena-tab-popup {
    position: absolute;
    right: 100%;
    top: 0;
    transform: translate(-5px);
    width: var(--tab);
    padding: 0px 10px 10px;
    background: var(--back2);
    border-bottom: 1px solid var(--back1);
    text-align: left;
}

.scena-tab-popup h2 {
    margin: 0;
    color: white;
    font-weight: bold;
    font-size: 14px;
    padding: 8px 0px;
}

.scena-tab-line {
    position: relative;
    display: block;
}

`);
const TABS: Array<typeof Tab> = [
    CurrentTab,
    AlignTab,
    FontTab,
    LayerTab,
    TransformTab,
    FrameTab,
];
export default class Tabs extends React.PureComponent {
    public tabs = React.createRef<StyledElement>();
    public state = {
        selected: "",
    }
    public render() {
        return <TabsElement className={prefix("tabs")} ref={this.tabs} onMouseOver={this.onMouseOver} onMouseOut={this.blur}>
            {this.renderTabs()}
        </TabsElement>;
    }
    public renderTabs() {
        const selected = this.state.selected;
        return TABS.map(UserTab => {
            const id = UserTab.id;
            const isSelected = id === selected;
            const IconComponent = UserTab.icon;
            return <div key={id} className={prefix("tab", isSelected ? "selected" : "")}>
                <div data-target-id={id} className={prefix("tab-icon")} onClick={this.onClick}>
                    {IconComponent ? <IconComponent /> : <span>{id}</span>}
                </div>
                {isSelected && <UserTab />}
            </div>;
            // return <UserTab moveable={moveable} />;
        });
    }
    public blur = () => {
        this.tabs.current!.getElement().classList.remove("scena-over");
    }
    private onClick = (e: any) => {
        this.onMouseOver();
        const target = e.target;
        const prevSelected = this.state.selected;
        const selected = target.getAttribute("data-target-id");
        this.setState({
            selected: prevSelected === selected ? "" : selected,
        });
    }
    private onMouseOver = () => {
        this.tabs.current!.getElement().classList.add("scena-over");
    }
}
