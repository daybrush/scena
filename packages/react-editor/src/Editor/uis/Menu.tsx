/* eslint-disable react/prop-types */
import * as React from "react";
import styled from "react-css-styled";
import { atom, useStoreValue } from "@scena/react-store";
import { prefix } from "../utils/utils";
import { CheckedIcon } from "./icons";


export interface MenuListProps {
    x?: number;
    y?: number;
    checked?: string[];
    items: MenuItem[];
    onSelect?: (e: MenuItem) => void;
}
export interface MenuItem {
    name: string;
    title?: string;
    icon?: () => JSX.Element;
    shortcut?: string;
}


const MenuListElement = styled("div", `
{
    position: fixed;
    z-index: 12;
    transform: translateZ(10px);
    padding: 5px 0px;
    background: var(--scena-editor-color-background-tool);
    color: var(--scena-editor-color-text);
    left: 0;
}
.scena-menu-item {
    width: 250px;
    padding: 5px 10px;
    display: flex;

    background: var(--scena-editor-color-background-tool);
    transition: background ease 0.2s;
    font-size: 13px;
    font-weight: bold;
    align-items: center;
}
.scena-menu-item:hover {
    background: var(--scena-editor-color-selected);
    --scena-editor-color-icon: var(--scena-editor-color-text-selected);
    --scena-editor-color-text: var(--scena-editor-color-text-selected);
    color: var(--scena-editor-color-text);
}
.scena-menu-item-icon {
    width: 24px;
    height: 24px;
    padding: 1px;
    box-sizing: border-box;
    margin-right: 5px;
}
.scena-menu-item-checked {
    width: 20px;
    height: 20px;
    padding: 1px;
    box-sizing: border-box;
    text-align: center;
}

.scena-menu-item-icon svg * {
    fill: var(--scena-editor-color-text);
    stroke: var(--scena-editor-color-text);
}

.scena-menu-item-text {
    flex: auto;
    height: 30px;
    line-height: 30px;
}
.scena-menu-item-shortcut {
    text-align: right;
    height: 30px;
    line-height: 30px;
}
`);

export const $openMenu = atom<((props: MenuListProps) => void) | null>(null);


export default function MenuList() {
    const [props, setProps] = React.useState<MenuListProps>({
        items: [],
    });
    useStoreValue($openMenu, React.useCallback((props: MenuListProps) => {
        setProps({
            checked: [],
            ...props,
        });
    }, []));
    const checked = props.checked!;
    const menuItems = props.items;
    const length = props.items.length;


    React.useEffect(() => {
        if (!length) {
            return;
        }
        const onClick = (e: any) => {
            if (e.__STOP__MENU) {
                return;
            }
            setProps({
                items: [],
            });
        };
        window.addEventListener("click", onClick);

        return () => {
            window.removeEventListener("click", onClick);
        };
    }, [props]);

    return <MenuListElement className={prefix("menu-list")} style={{
        display: length ? "block" : "none",
        top: `${props.y || 0}px`,
        left: `${props.x || 0}px`,
    }} onClick={(e: any) => {
        const event = e.nativeEvent || e;

        event.__STOP__MENU = true;
    }}>
        {menuItems.map(item => {
            const {
                name,
                title,
                shortcut = "",
                icon: Icon,
            } = item;

            return <div key={name} className={prefix("menu-item")} onClick={() => {
                setProps({ items: [] });
                props.onSelect?.(item);
            }}>
                <div className={prefix("menu-item-checked")}>
                    {checked.some(menuName => menuName === name) && <CheckedIcon />}
                </div>
                <div className={prefix("menu-item-icon")}>{Icon && <Icon />}</div>
                <div className={prefix("menu-item-text")}>{title}</div>
                <div className={prefix("menu-item-shortcut")}>{shortcut}</div>
            </div>;
        })}
    </MenuListElement>;
}
