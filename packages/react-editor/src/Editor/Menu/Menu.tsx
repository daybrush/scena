import * as React from "react";
import { prefix } from "../utils/utils";
import MoveToolIcon from "./MoveToolIcon";
import "./Menu.css";
import TextIcon from "./TextIcon";
import CropIcon from "./CropIcon";
import RectIcon from "./RectIcon";
import OvalIcon from "./OvalIcon";
import RoundRectIcon from "./RoundRectIcon";
import Icon from "./Icon";
import Editor from "../Editor";
import KeyboardIcon from "./KeyboardIcon";

const MENUS: Array<typeof Icon> = [
    MoveToolIcon,
    TextIcon,
    CropIcon,
    RectIcon,
    RoundRectIcon,
    OvalIcon,
];
export default class Menu extends React.PureComponent<{
    editor: Editor,
    onSelect: (id: string) => any
}> {
    public state = {
        selected: "MoveTool",
    };
    public menuRefs: Array<React.RefObject<Icon>> = [];
    public render() {
        return (
            <div className={prefix("menu")}>
                {this.renderMenus()}
                <div className={prefix("menu-bottom")}>
                    <KeyboardIcon editor={this.props.editor} />
                </div>
            </div>
        );
    }
    public renderMenus() {
        const selected = this.state.selected;
        const menuRefs = this.menuRefs;
        const editor = this.props.editor;

        return MENUS.map((MenuClass, i) => {
            const id = MenuClass.id;
            if (!menuRefs[i]) {
                menuRefs[i] = React.createRef();
            }
            return <MenuClass ref={menuRefs[i]} key={id} editor={editor} selected={selected === id} onSelect={this.select} />;
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
    public blur() {
        this.menuRefs.forEach(ref => {
            if (!ref.current) {
                return;
            }
            ref.current.blur();
        });
    }
}
