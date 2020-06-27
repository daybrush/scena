import * as React from "react";
import { prefix } from "../../utils";
import "./Tabs.css";
import TransformTab from "./TransformTab";
import Moveable from "react-moveable";
import Tab from "./Tab";
import FrameTab from "./FrameTab";

const TABS: Array<typeof Tab> = [
    TransformTab,
    FrameTab,
];
export default class Tabs extends React.PureComponent<{
    moveable: React.RefObject<Moveable>,
}> {
    public render() {
        return <div className={prefix("tabs")}>
            {this.renderTabs()}
        </div>;
    }
    public renderTabs() {
        const moveable = this.props.moveable;

        return TABS.map(UserTab => {
            return <UserTab moveable={moveable} />;
        });
    }
}
