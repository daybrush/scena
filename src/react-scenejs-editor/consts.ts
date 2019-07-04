import { DirectionType, FillModeType } from "scenejs";
import { IObject } from "@daybrush/utils";

export const PREFIX = `scenejs-editor-`;

export const INFOS_CSS = `
{
    position: fixed;
    right: 0;
    top: 0;
    width: 250px;
}
.info {
    margin-bottom: 5px;
    background: #3f3f3f;
}
.info .option {
    position: relative;
    border-bottom: 1px solid #555;
    box-sizing: border-box;
    white-space: nowrap;
    background: #3f3f3f;
    font-size: 12px;
    font-weight: bold;
    color: #eee;
    display: flex;
}
.info .option.title {
    border-bottom: 0;
}
.info .option.title h3 {
    padding: 7px 6px 7px 1px;
    margin: 0;
    font-size: 11px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    margin-left: 6px;
    margin-bottom: 2px;
}
.info .option .name, .info .option .value {
    height: 28px;
    line-height: 20px;
    box-sizing: border-box;
    padding: 4px;
}
.info .option .name {
    width: 110px;
    font-size: 12px;
    padding-left: 6px;
    text-align: left;
}
.info .option .value {
    flex: 1;
    background: transparent;
    border-bottom: 0;
    z-index: auto;
}
.info .option .value input {
    position: relative;
    text-align: left;
}
.info .option .value .unit {
    display: flex;
}
.info .value .select {
    position: relative;
    width: 100%;
    height: 100%;
}
.info .value .select:after {
    content: "";
    position: absolute;
    top: 50%;
    right: 2px;
    width: 0;
    height: 0;
    margin-top: 1px;
    border-top: 5px solid #666;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    transform: translate(-50%, -50%);
}
.info .value select {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: block;
    width: 100%;
    height: 100%;
    background: transparent;
    color: #4af;
    font-weight: bold;
    background: none;
    border: 0;
    box-sizing: border-box;
    text-align: center;
}
.info .option.add {
    display: block;
    padding: 6px;
}
.info .option.add .button {
    position: relative;
    width: auto;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    text-align: center;
    background: #555;
}
.info .option.add:hover .button {
    cursor: pointer;
    background: #666;
}

.info .option.add .button {
    position: relative;
    width: auto;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    text-align: center;
    background: #555;
}
.info .option.add:hover .button {
    cursor: pointer;
    background: #666;
}
.info .option.add .button.disable {
    cursor: not-allowed;
    color: #aaa;
    background: #444;
}
.info .group .option.title {
    border-bottom: 1px solid #555;
}
.info .group .option.title h3 {
    border-bottom: none;
    font-size: 12px;
}
.info .group .group {
    padding-left: 10px;
}
.info .color {
    z-index: 10;
}
.info .picker {
    position: absolute;
    right: 5px;
    top: 100%;
    z-index: 10;
}
`.replace(/\.([^{,\s\d.]+)/g, `.${PREFIX}$1`);

export const MENUS_CSS = `
{
    position: fixed;
    left: 0;
    top: 0;
}
`.replace(/\.([^{,\s\d.]+)/g, `.${PREFIX}$1`);

export const DIRECTIONS: DirectionType[] = ["normal", "reverse", "alternate", "alternate-reverse"];
export const FILL_MODES: FillModeType[] = ["forwards", "backwards", "both"];

export const ANGLE_TYPE = ["unit", ["deg", "rad"]];
export const SIZE_TYPE = [
    "unit",
    [
        "auto", "px", "", "%", "em", "vw", "vh", "pt", "cm", "mm", "in", "pc", "ch", "rem", "vmin", "vmax",
    ],
];
export const PROPERTY_TYPES: IObject<any> = {
    "transform": "group",
    "filter": "group",
    "width": SIZE_TYPE,
    "height": SIZE_TYPE,
    "color": "color",
    "background-color": "color",
    "border-left-color": "color",
    "border-right-color": "color",
    "border-top-color": "color",
    "border-bottom-color": "color",
    "opacity": "number",
    "transform///rotate": ANGLE_TYPE,
    "transform///rotateX": ANGLE_TYPE,
    "transform///rotateY": ANGLE_TYPE,
    "transform///rotateZ": ANGLE_TYPE,
    "transform///skewX": ANGLE_TYPE,
    "transform///skewY": ANGLE_TYPE,
    "transform///scaleX": "number",
    "transform///scaleY": "number",
};
