import * as React from "react";
import { prefix } from "../../utils";
import Menu from "./Menu";
import styler from "react-css-styler";
import { MENUS_CSS } from "../../consts";
import CursorIcon from "./CursorIcon";
import AutoCursorIcon from "./AutoCursorIcon";
import TextIcon from "./TextIcon";
import PolyIcon from "./PolyIcon";
import OvalIcon from "./OvalIcon";
import RectIcon from "./RectIcon";
import StarIcon from "./StarIcon";
import Moveable from "../../../react-moveable/Moveable";

const MenusElement = styler("div", MENUS_CSS);

export default class Menus extends React.PureComponent<{
}, {
    type: string,
}> {
    public state = {
        type: "cursor",
    };
    public render() {
        const type = this.state.type;
        const onSelected = this.onSelected;

        return (
            <MenusElement className={prefix("menus")}>
                <Menu icon={CursorIcon} type="cursor" selected={type === "cursor"} onSelected={onSelected} />
                <Menu icon={AutoCursorIcon} type="auto" selected={type === "auto"} onSelected={onSelected} />
                <Menu icon={TextIcon} type="text" selected={type === "text"} onSelected={onSelected} />
                <Menu icon={RectIcon} type="rect" selected={type === "rect"} onSelected={onSelected} />
                <Menu icon={PolyIcon} type="poly" selected={type === "poly"} onSelected={onSelected} />
                <Menu icon={StarIcon} type="star" selected={type === "star"} onSelected={onSelected} />
                <Menu icon={OvalIcon} type="oval" selected={type === "oval"} onSelected={onSelected} />
            </MenusElement>);
    }
    public onSelected = (e: { type: string }) => {
        if (this.state.type === e.type) {
            return;
        }
        this.setState({
            type: e.type,
        });
    }
}
