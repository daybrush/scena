import * as React from "react";
import { prefix } from "../../utils";
import MoveToolIcon from "./MoveToolIcon";
import "./Menu.css";
import TextIcon from "./TextIcon";
import CropIcon from "./CropIcon";
import RectIcon from "./RectIcon";
import OvalIcon from "./OvalIcon";
import RoundRectIcon from "./RoundRectIcon";

const MENUS = [
    MoveToolIcon,
    TextIcon,
    CropIcon,
    RectIcon,
    RoundRectIcon,
    OvalIcon,
];
export default class Menu extends React.PureComponent<{
    onSelect: (id: string) => any
}> {
    public state = {
        selectedID: "MoveTool",
    };
    public render() {
        return (
            <div className={prefix("menu")}>
                {this.renderMenus()}
            </div>
        );
    }
    public renderMenus() {
        const selectedID = this.state.selectedID;

        return MENUS.map(MenuClass => {
            const menuID = MenuClass.id;
            return <MenuClass selected={selectedID === menuID} onSelect={this.select} />;
        });
    }
    public select = (id: string) => {
        this.setState({
            selectedID: id,
        });
        this.props.onSelect(id);
    }
}
