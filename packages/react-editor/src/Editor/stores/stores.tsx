import { MutableRefObject } from "react";
import Moveable, { MoveableTargetGroupsType } from "react-moveable";
import Selecto from "react-selecto";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import { GroupManager } from "@moveable/helper";

import ClipboardManager from "../managers/ClipboardManager";
import HistoryManager from "../managers/HistoryManager";
import LayerManager from "../managers/LayerManager";
import KeyManager from "../managers/KeyManager";
import MemoryManager from "../managers/MemoryManager";
import ActionManager from "../managers/ActionManager";

import { EditorManagerInstance } from "../EditorManager";

// import Menu from "../Menu/Menu";

import { atom } from "../Store/Store";
import { ScenaElementLayer } from "../types";





export const $layerManager = atom<LayerManager | null>(null);
export const $historyManager = atom<HistoryManager | null>(null);
export const $clipboardManager = atom<ClipboardManager | null>(null);
export const $keyManager = atom<KeyManager | null>(null);
export const $memoryManager = atom<MemoryManager | null>(null);
export const $actionManager = atom<ActionManager | null>(null);

export const $horizontalGuidelines = atom<number[]>([]);
export const $verticalGuidelines = atom<number[]>([]);
export const $selectedTargets = atom<MoveableTargetGroupsType>([]);
export const $layers = atom<ScenaElementLayer[]>([]);
export const $zoom = atom<number>(1);
export const $selectedTool = atom<string>("pointer");
export const $pointer = atom<string>("move");
export const $rect = atom<string>("rect");

export const $editor = atom<MutableRefObject<EditorManagerInstance | undefined> | null>(null);
export const $selecto = atom<MutableRefObject<Selecto | null> | null>(null);
export const $moveable = atom<MutableRefObject<Moveable | null> | null>(null);
export const $infiniteViewer = atom<MutableRefObject<InfiniteViewer | null> | null>(null);
export const $horizontalGuides = atom<MutableRefObject<Guides | null> | null>(null);
export const $verticalGuides = atom<MutableRefObject<Guides | null> | null>(null);
// export const $menu = atom<MutableRefObject<Menu | null> | null>(null);



