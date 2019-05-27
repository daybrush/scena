import Scene, { SceneItem } from "scenejs";
import { IObject } from "@daybrush/utils";
import { HTMLAttributes } from "react";

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
    scene?: Scene | SceneItem;
}
export interface TimelineState {
    zoom: number;
    alt: boolean;
    maxDuration: number;
    maxTime: number;
    timelineInfo: TimelineInfo;
    selectedProperty: string;
    selectedTime: number;
}
export interface PropertiesInfo {
    key: string;
    keys: Array<number | string>;
    parentItem: Scene;
    item: Scene | SceneItem;
    isParent: boolean;
    isItem: boolean;
    names: Array<number | string>;
    properties: string[];
    frames: Array<[number, number, any]>;
}
export type TimelineInfo = IObject<PropertiesInfo>;
