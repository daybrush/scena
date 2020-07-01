import * as React from "react";
import { prefix } from "../../utils";
import MoveToolIcon from "./MoveToolIcon";
import "./Menu.css";
import TextIcon from "./TextIcon";
import CropIcon from "./CropIcon";
import RectIcon from "./RectIcon";
import OvalIcon from "./OvalIcon";
import RoundRectIcon from "./RoundRectIcon";
import Icon from "./Icon";

const MENUS: Array<typeof Icon> = [
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
        selected: "MoveTool",
    };
    public render() {
        return (
            <div className={prefix("menu")}>
                {this.renderMenus()}
            </div>
        );
    }
    public renderMenus() {
        const selected = this.state.selected;

        return MENUS.map(MenuClass => {
            const id = MenuClass.id;
            return <MenuClass selected={selected === id} onSelect={this.select} />;
        });
    }
    public select = (id: string) => {
        this.setState({
            selected: id,
        });
        this.props.onSelect(id);
    }
    public getSelected(): typeof Icon | undefined {
        const selected = this.state.selected;
        return MENUS.filter(m => m.id === selected)[0];
    }
}
