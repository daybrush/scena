import * as React from "react";
import styled from "react-css-styled";
import { StoreStateType, StoreValue, useStoreState, useStoreStateValue, useStoreValue } from "@scena/react-store";
import { $darkMode, $pointer, $rect, $selectedTool } from "../stores/stores";
import { prefix } from "../utils/utils";
import {
    MoveToolIcon,
    FontIcon,
    CropIcon,
    ScenaIcon,
    RectIcon,
    TransformIcon,
    RoundRectIcon,
    OvalIcon,
    LightModeIcon,
} from "./icons";
import { $openMenu, MenuItem } from "./Menu";
import { DarkModeIcon } from "./icons";

const ToolBarElement = styled("div", `
{
    --scena-editor-size-tools: 45px;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--scena-editor-size-tools);
    background: var(--scena-editor-color-background-tool);
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 10;
    transform: translateZ(1px);
    display: flex;
    justify-content: flex-start;
}
.scena-menu-bottom {
    position: absolute;
    top: 0;
    right: 0;
    padding: 7px 7px 0px;
    height: 100%;
    box-sizing: border-box;
}
svg, .scena-i {
    pointer-events: none;
}
.scena-icon {
    position: relative;
    display: inline-block;
    width: var(--scena-editor-size-tools);
    height: var(--scena-editor-size-tools);
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 0px;
    transition: all ease 0.2s;
    vertical-align: top;
}

.scena-icon-inner {
    position: relative;
    padding: 10px;
    display: flex;
    align-items: center;
    justified-contents: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.scena-tool-left>.scena-icon:hover, .scena-tool-right>.scena-icon:hover  {
    --scena-editor-color-icon: #fff;
    background: #000;
}
.scena-tool-left>.scena-icon.scena-selected {
    background: var(--scena-editor-color-main);
}
.scena-icon.scena-selected {
    --scena-editor-color-icon: #fff;
}
.scena-icon.scena-selected svg *,
.scena-sub-icon.scena-selected svg * {
    fill: #fff;
    stroke: #fff;
}
.scena-icon .scena-extends-icon {
    position: absolute;
    right: 4px;
    bottom: 4px;
    border-bottom: 5px solid var(--scena-editor-color-icon);
    border-right: 0;
    border-left: 5px solid transparent;
    pointer-events: none;
}
.scena-tool-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--scena-editor-color-text);
    font-weight: bold;
    font-size: 12px;
}
.scena-tool-right {
    position: absolute;
    right: 0;
}
`);


interface Tool {
    name: string;
    className?: string;
    title?: string;
    icon: (props: { selected?: boolean }) => JSX.Element;
    isExtends?: boolean;
}

const POINTER_MENU_ITEMS: MenuItem[] = [
    {
        name: "move",
        title: "Move",
        icon: MoveToolIcon,
    },
    {
        name: "scale",
        title: "Scale",
        icon: TransformIcon,
    },
];
const RECT_MENU_ITEMS: MenuItem[] = [
    {
        name: "rect",
        title: "Rectangle",
        icon: RectIcon,
    },
    {
        name: "roundRect",
        title: "Round Rectangle",
        icon: RoundRectIcon,
    },
    {
        name: "oval",
        title: "Oval",
        icon: OvalIcon,
    },
];


function openToolMenu(
    items: MenuItem[],
    checked: string[],
    onSelect: (e: MenuItem) => void,
) {
    const store = useStoreValue($openMenu);

    return (e: React.BaseSyntheticEvent<MouseEvent>) => {
        const currentTarget = e.currentTarget as HTMLElement;
        const rect = currentTarget.getBoundingClientRect();

        store.value({
            x: rect.left,
            y: rect.bottom + 10,
            checked,
            items,
            onSelect,
        });
    };
}
const TOOLS: Tool[] = [
    {
        name: "",
        icon: ScenaIcon,
        className: "menu-main",
    },
    {
        name: "pointer",
        isExtends: true,
        icon: ({ selected }) => {
            const [pointer, setPointer] = useStoreState($pointer);
            const icon = POINTER_MENU_ITEMS.find(({ name }) => name === pointer)?.icon || MoveToolIcon;


            return <ToolIcon
                icon={icon}
                selected={selected}
                onSelect={openToolMenu(
                    POINTER_MENU_ITEMS,
                    [pointer],
                    e => setPointer(e.name),
                )}
            />;
        },
    },
    {
        name: "text",
        icon: FontIcon,
    },
    {
        name: "crop",
        icon: CropIcon,
    },
    {
        name: "shape",
        isExtends: true,
        icon: ({ selected }) => {
            const [rect, setRect] = useStoreState($rect);
            const icon = RECT_MENU_ITEMS.find(({ name }) => name === rect)?.icon || RectIcon;

            return <ToolIcon
                icon={icon}
                selected={selected}
                onSelect={openToolMenu(
                    RECT_MENU_ITEMS,
                    [rect],
                    e => setRect(e.name),
                )}
            />;
        },
    },
];

function DarkModeTool() {
    const [isDarkMode, setDarkMode] = useStoreState($darkMode);

    return <div className={prefix("icon")} onClick={() => {
        setDarkMode(!isDarkMode);
    }}>
        <ToolIcon icon={() => {
            if (isDarkMode) {
                return <LightModeIcon />;
            } else {
                return <DarkModeIcon />;
            }
        }} />
    </div>;
}
const ToolIcon = (props: {
    selected?: boolean;
    icon?: () => JSX.Element,
    onSelect?: (e: React.BaseSyntheticEvent<MouseEvent>) => void;
}) => {
    const {
        icon: Icon,
        onSelect,
        selected,
    } = props;
    return <div className={prefix("icon-inner")} onClick={e => {
        if (selected) {
            onSelect?.(e);
        }
    }}>
        {Icon && <Icon />}
    </div>;
};

const ToolBar = () => {
    const [selectedTool, setSelectedTool] = useStoreState($selectedTool);

    return <ToolBarElement className={prefix("menu")}>
        <div className="scena-tool-left">
            {TOOLS.map(({ className, name, icon: Icon, isExtends }) => {
                const selected = name === selectedTool;
                return <div
                    key={name}
                    className={prefix("icon", selected ? "selected" : "", className || "")}
                    onClick={() => {
                        if (name) {
                            setSelectedTool(name);
                        }
                    }}>
                    {isExtends ? <Icon selected={selected} /> : <ToolIcon icon={() => <Icon />} selected={selected} />}
                    {isExtends && <div className={prefix("extends-icon")} />}
                </div>;
            })}
        </div>
        <div className="scena-tool-title">
            Scena Studio
        </div>
        <div className="scena-tool-right">
            <DarkModeTool />
        </div>
    </ToolBarElement>;
};

export default ToolBar;
