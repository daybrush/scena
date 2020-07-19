import { IObject } from "@daybrush/utils";
import Memory from "./utils/Memory";
import EventBus from "./utils/EventBus";
import MoveableData from "./utils/MoveableData";
import MoveableManager from "./Viewport/MoveableMananger";
import KeyManager from "./KeyManager/KeyManager";
import Editor from "./Editor";
import HistoryManager from "./utils/HistoryManager";
import Debugger from "./utils/Debugger";

export interface ScenaEditorState {
    selectedTargets: Array<SVGElement | HTMLElement>;
    horizontalGuides: number[];
    verticalGuides: number[];
    selectedMenu: string;
    zoom: number;
}

export interface TagAppendInfo {
    tag: any;
    props: IObject<any>;
    name: string;
    frame: IObject<any>;
}


export interface EditorInterface {
    editor: Editor;
    memory: Memory;
    eventBus: EventBus;
    moveableData: MoveableData;
    keyManager: KeyManager;
    historyManager: HistoryManager;
    console: Debugger;
    moveableManager: React.RefObject<MoveableManager>;
}