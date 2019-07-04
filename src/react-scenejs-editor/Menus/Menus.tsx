import * as React from "react";
import { prefix } from "../utils";
import Menu from "./Menu";
import styler from "react-css-styler";
import { MENUS_CSS } from "../consts";

const MenusElement = styler("div", MENUS_CSS);

export default class Menus extends React.Component<{
}> {
    public render() {
        return (
            <MenusElement className={prefix("menus")}>
                <Menu/>
            </MenusElement>);
    }
}
