import Scene, { SceneItem } from "scenejs";

export interface SelectEvent {
    selectedItem: Scene | SceneItem;
    selectedProperty: string;
    selectedTime: number;
    prevSelectedProperty: string;
    prevSelectedTime: number;
}

export type AttributeKeys = Exclude<keyof JSX.HTMLAttributes, "onSelect">;
export type TimelineAttributes = {[key in AttributeKeys]?: JSX.HTMLAttributes[key]};
export interface TimelineProps extends TimelineAttributes {
    scene?: Scene | SceneItem;
    keyboard?: boolean;
    onSelect?: (e: SelectEvent) => any;
}
