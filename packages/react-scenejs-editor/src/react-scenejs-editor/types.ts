import { SceneItem, Frame } from "scenejs";

export interface EditorState {
    selectedFrame: Frame | null;
    selectedItem: SceneItem | null;
    selectedTarget: HTMLElement | SVGElement | Array<HTMLElement | SVGElement> | null;
}
