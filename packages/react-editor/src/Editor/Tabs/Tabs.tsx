import * as React from "react";
import { prefix } from "../utils/utils";
import TransformTab from "./TransformTab";
import Tab from "./Tab";
import FrameTab from "./FrameTab/FrameTab";
import AlignTab from "./AlignTab/AlignTab";
import LayerTab from "./LayerTab/LayerTab";
import CurrentTab from "./ColorTab/ColorTab";
import FontTab from "./FontTab/FontTab";
import Editor from "../Editor";
import styled, { StyledElement } from "react-css-styled";

const TabsElement = styled("div", `
{
    position: absolute;
    right: 0;
    width: 80px;
    height: 100%;
    background: var(--back2);
    z-index: 10;
    transform: translateZ(10px);
    box-sizing: border-box;
    padding-top: 30px;
    transition: width ease 0.2s;
    text-align: left;
}

.scena-tab-icon {
    position: relative;
    margin: 5px;
}

.scena-tab-icon-label {
    position: relative;
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    word-break: break-all;
    padding: 5px;
    width: 100%;
    line-height: 20px;
    height: 30px;
    box-sizing: border-box;
    border-radius: 3px;
    text-align: left;
    overflow: hidden;
}

.scena-tab-icon-label span {
    display: inline-block;
    pointer-events: none;
    font-size: 11px;
}

.scena-tab-icon.scena-selected .scena-tab-icon-label {
    background: var(--mainColor);
}

.scena-tab {
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

.scena-tab h2 {
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

@media screen and (max-width: 800px) {
    {
        width: 40px;
    }
    .scena-tabs.scena-over {
        width: 80px;
    }
    .scena-tab-icon-label span:first-letter {
        visibility: visible;
        font-size: 11px;
    }
    .scena-tab-icon-label {
        text-align: center;
    }
    :host.scena-over .scena-tab-icon-label {
        text-align: left;
    }
    .scena-tab-icon-label span {
        visibility: hidden;
        font-size: 0;
        overflow: hidden;
    }
    :host.scena-over .scena-tab-icon-label span {
        font-size: 11px;
        visibility: visible;
    }
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
export default class Tabs extends React.PureComponent<{
    editor: Editor,
}> {
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
        const editor = this.props.editor;
        const selected = this.state.selected;
        return TABS.map(UserTab => {
            const id = UserTab.id;
            const isSelected = id === selected;
            return <div key={id} className={prefix("tab-icon", isSelected ? "selected" : "")}>
                <div data-target-id={id} className={prefix("tab-icon-label")} onClick={this.onClick}><span>{UserTab.id}</span></div>
                {isSelected && <UserTab editor={editor} />}
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
