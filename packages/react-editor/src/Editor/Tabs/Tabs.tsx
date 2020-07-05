import * as React from "react";
import { prefix } from "../utils/utils";
import "./Tabs.css";
import TransformTab from "./TransformTab";
import Moveable from "react-moveable";
import Tab from "./Tab";
import FrameTab from "./FrameTab/FrameTab";
import AlignTab from "./AlignTab/AlignTab";
import LayerTab from "./LayerTab/LayerTab";
import CurrentTab from "./ColorTab/ColorTab";

const TABS: Array<typeof Tab> = [
    CurrentTab,
    AlignTab,
    LayerTab,
    TransformTab,
    FrameTab,
];
export default class Tabs extends React.PureComponent<{
    moveable: React.RefObject<Moveable>,
}> {
    public state = {
        selected: "",
    }
    public render() {
        return <div className={prefix("tabs")}>
            {this.renderTabs()}
        </div>;
    }
    public renderTabs() {
        const moveable = this.props.moveable;
        const selected = this.state.selected;
        return TABS.map(UserTab => {
            const id = UserTab.id;
            const isSelected = id === selected;
            return <div key={id} className={prefix("tab-icon", isSelected ? "selected" : "")}>
                <div data-target-id={id} className={prefix("tab-icon-label")} onClick={this.onClick}>{UserTab.id}</div>
                {isSelected && <UserTab moveable={moveable} />}
            </div>;
            // return <UserTab moveable={moveable} />;
        });
    }
    private onClick = (e: any) => {
        const target = e.target;
        const prevSelected = this.state.selected;
        const selected = target.getAttribute("data-target-id");
        this.setState({
            selected: prevSelected === selected ? "" : selected,
        });
    }
}
