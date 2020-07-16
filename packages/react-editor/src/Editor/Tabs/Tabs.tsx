import * as React from "react";
import { prefix } from "../utils/utils";
import "./Tabs.css";
import TransformTab from "./TransformTab";
import Tab from "./Tab";
import FrameTab from "./FrameTab/FrameTab";
import AlignTab from "./AlignTab/AlignTab";
import LayerTab from "./LayerTab/LayerTab";
import CurrentTab from "./ColorTab/ColorTab";
import FontTab from "./FontTab/FontTab";
import Editor from "../Editor";

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
    public tabs = React.createRef<HTMLDivElement>();
    public state = {
        selected: "",
    }
    public render() {
        return <div className={prefix("tabs")} ref={this.tabs} onMouseOver={this.onMouseOver} onMouseOut={this.blur}>
            {this.renderTabs()}
        </div>;
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
        this.tabs.current!.classList.remove("scena-over");
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
        this.tabs.current!.classList.add("scena-over");
    }
}
