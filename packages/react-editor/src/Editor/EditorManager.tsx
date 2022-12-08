/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import { GroupManager } from "@moveable/helper";
import Guides from "@scena/react-guides";
import Selecto from "react-selecto";
import styled, { StyledElement } from "react-css-styled";
import Moveable, { MoveableTargetGroupsType } from "react-moveable";

// import Menu from "./Menu/Menu";
import Viewport, { ViewportInstnace } from "./Viewport/Viewport";
import { prefix, checkInput, getParnetScenaElement } from "./utils/utils";

import LayerManager from "./managers/LayerManager";
import KeyManager from "./managers/KeyManager";
import HistoryManager from "./managers/HistoryManager";
import ActionManager from "./managers/ActionManager";
import MemoryManager from "./managers/MemoryManager";

import { EDITOR_CSS } from "./consts";
// import ClipboardManager from "./utils/ClipboardManager";


import { useStoreStateSetPromise, useStoreValue } from "./Store/Store";
import {
    $actionManager, $layerManager, $editor, $groupManager,
    $historyManager, $horizontalGuides, $infiniteViewer,
    $keyManager, $layers, $memoryManager, $moveable,
    $selectedTargets, $selecto, $verticalGuides,
} from "./stores/stores";


import { GuidesManager } from "./components/GuidesManager";
import { InfiniteViewerManager } from "./components/InfiniteViewerManager";
import { SelectoManager } from "./components/SelectoManager";
import { MoveableManager } from "./components/MoveableManager";
import { deepFlat } from "@daybrush/utils";
import { ScenaElementLayer } from "./types";
import { SceneItem } from "scenejs";


const EditorElement = styled("div", EDITOR_CSS);

// function undoCreateElements({ infos, prevSelected }: Record<string, any>, editor: EditorManagerInstance) {
//     const res = editor.removeByIds(infos.map((info: ElementInfo) => info.id), true);

//     if (prevSelected) {
//         res.then(() => {
//             editor.setSelectedTargets(editor.viewportRef.current!.getElements(prevSelected), true);
//         })
//     }
// }
// function restoreElements({ infos }: Record<string, any>, editor: EditorManagerInstance) {
//     editor.appendJSXs(infos.map((info: ElementInfo) => ({
//         ...info,
//     })), true);
// }
// function undoSelectTargets({ prevs, nexts }: Record<string, any>, editor: EditorManagerInstance) {
//     editor.setSelectedTargets(editor.viewportRef.current!.getElements(prevs), true);
// }
// function redoSelectTargets({ prevs, nexts }: Record<string, any>, editor: EditorManagerInstance) {
//     editor.setSelectedTargets(editor.viewportRef.current!.getElements(nexts), true);
// }
// function undoChangeText({ prev, next, id }: Record<string, any>, editor: EditorManagerInstance) {
//     const info = editor.viewportRef.current!.getInfo(id)!;
//     info.innerText = prev;
//     info.el!.innerText = prev;
// }
// function redoChangeText({ prev, next, id }: Record<string, any>, editor: EditorManagerInstance) {
//     const info = editor.viewportRef.current!.getInfo(id)!;
//     info.innerText = next;
//     info.el!.innerText = next;
// }
// function undoMove({ prevInfos }: MovedResult, editor: EditorManagerInstance) {
//     editor.moves(prevInfos, true);
// }
// function redoMove({ nextInfos }: MovedResult, editor: EditorManagerInstance) {
//     editor.moves(nextInfos, true);
// }


export interface EditorManagerInstance {
    historyManager: HistoryManager;
    actionManager: ActionManager;
    memoryManager: MemoryManager;
    layerManager: LayerManager;
    keyManager: KeyManager;
    groupManager: GroupManager;

    // menuRef: React.MutableRefObject<Menu | null>;
    moveableRef: React.MutableRefObject<Moveable | null>;
    selectoRef: React.MutableRefObject<Selecto | null>;
    viewportRef: React.MutableRefObject<ViewportInstnace | null>;

    setSelectedTargets(targets: MoveableTargetGroupsType, isRestore?: boolean): Promise<boolean>;
}

export default function EditorManager2() {
    const editorRef = React.useRef<EditorManagerInstance>();

    const historyManager = React.useMemo(() => new HistoryManager(editorRef), []);
    const actionManager = React.useMemo(() => new ActionManager(), []);
    const memoryManager = React.useMemo(() => new MemoryManager(), []);
    const layerManager = React.useMemo(() => new LayerManager(), []);
    const keyManager = React.useMemo(() => new KeyManager(actionManager), []);
    const groupManager = React.useMemo(() => new GroupManager([]), []);


    const horizontalGuidesRef = React.useRef<Guides>(null);
    const verticalGuidesRef = React.useRef<Guides>(null);
    const infiniteViewerRef = React.useRef<InfiniteViewer>(null);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    // const menuRef = React.useRef<Menu>(null);
    const viewportRef = React.useRef<ViewportInstnace>(null);
    // const tabsRef = React.useRef<Tabs>(null);
    const editorElementRef = React.useRef<StyledElement<HTMLDivElement>>(null);


    // declare global store
    useStoreValue($historyManager, historyManager);
    useStoreValue($actionManager, actionManager);
    useStoreValue($memoryManager, memoryManager);
    useStoreValue($layerManager, layerManager);
    useStoreValue($keyManager, keyManager);
    useStoreValue($groupManager, groupManager);

    // declare global ui component
    useStoreValue($moveable, moveableRef);
    useStoreValue($selecto, selectoRef);
    useStoreValue($infiniteViewer, infiniteViewerRef);
    useStoreValue($horizontalGuides, horizontalGuidesRef);
    useStoreValue($verticalGuides, verticalGuidesRef);
    useStoreValue($editor, editorRef);

    const layers: ScenaElementLayer[] = React.useMemo(() => [
        {
            id: "1",
            scope: [],
            jsx: <div style={{
                position: "relative",
                border: "1px solid #333",
                width: "100px",
                height: "100px",
            }}></div>,
            item: new SceneItem(),
            ref: React.createRef<HTMLElement | null>() as React.MutableRefObject<HTMLElement | null>,
        }
    ], []);

    layerManager.setLayers(layers);

    useStoreValue($layers, layers);

    React.useEffect(() => {
        console.log(layers);
    }, []);



    const setSelectedTargetsPromise = useStoreStateSetPromise($selectedTargets);
    const onBlur = React.useCallback((e: any) => {
        const target = e.target as HTMLElement | SVGElement;

        if (!checkInput(target)) {
            return;
        }
        const parentTarget = getParnetScenaElement(target);

        if (!parentTarget) {
            return;
        }
        // const info = viewportRef.current!.getInfoByElement(parentTarget)!;


        // if (!info.attrs!.contenteditable) {
        //     return
        // }
        // const nextText = (parentTarget as HTMLElement).innerText;

        // if (info.innerText === nextText) {
        //     return;
        // }
        // historyManager.addHistory("changeText", {
        //     id: info.id,
        //     prev: info.innerText,
        //     next: nextText,
        // });
        // info.innerText = nextText;
    }, []);

    const setSelectedTargets = React.useCallback((targets: MoveableTargetGroupsType, isRestore?: boolean) => {
        // const prevTargets = selectedTargetsStore.value;

        return setSelectedTargetsPromise(targets).then(complete => {
            if (!complete) {
                return false;
            }
            if (!isRestore) {
                // const prevs = getIds(prevTargets);
                // const nexts = getIds(selectedTargetsStore.value);

                // if (prevs.length !== nexts.length || !prevs.every((prev, i) => nexts[i] === prev)) {
                //     historyManager.addHistory("selectTargets", { prevs, nexts });
                // }
            }
            selectoRef.current!.setSelectedTargets(deepFlat(targets));
            actionManager.trigger("setSelectedTargets");
            return true;
        });
    }, []);

    editorRef.current = React.useMemo<EditorManagerInstance>(() => {
        return {
            historyManager,
            actionManager,
            memoryManager,
            layerManager,
            keyManager,
            groupManager,
            moveableRef,
            selectoRef,
            viewportRef,
            // menuRef,
            setSelectedTargets,
        };
    }, []);


    React.useEffect(() => {
        const onResize = () => {
            horizontalGuidesRef.current!.resize();
            verticalGuidesRef.current!.resize();
        };
        const startId = requestAnimationFrame(() => {
            onResize();
            infiniteViewerRef.current!.scrollCenter();
        });

        window.addEventListener("resize", onResize);


        return () => {
            cancelAnimationFrame(startId);
            window.removeEventListener("resize", onResize);
        };
    })
    return React.useMemo(() => <EditorElement className={prefix("editor")} ref={editorElementRef}>
        {/* <Tabs ref={tabsRef} /> */}
        {/* <Menu ref={menuRef} onSelect/> */}
        <div className={prefix("reset")} onClick={() => {
            infiniteViewerRef.current!.scrollCenter({ duration: 500, absolute: true });
        }}></div>
        <GuidesManager ref={horizontalGuidesRef} type="horizontal" />
        <GuidesManager ref={verticalGuidesRef} type="vertical" />
        <InfiniteViewerManager ref={infiniteViewerRef}>
            <Viewport ref={viewportRef} onBlur={onBlur}
                style={{
                    width: `600px`,
                    height: `800px`,
                }}>
                <MoveableManager ref={moveableRef} />
            </Viewport>
        </InfiniteViewerManager>
        <SelectoManager ref={selectoRef} />
    </EditorElement>, []);
}

// export class EditorManager extends React.PureComponent<{
//     width: number,
//     height: number,
//     debug?: boolean,
// }, Partial<ScenaEditorState>> {
//     public static contextType = StoreRootContext;
//     public static defaultProps = {
//         width: 400,
//         height: 600,
//     };
//     public state: ScenaEditorState = {
//         selectedTargets: [],
//         horizontalGuides: [],
//         verticalGuides: [],
//         zoom: 1,
//         selectedMenu: "MoveTool",
//     };
//     public historyManager = new HistoryManager(this);
//     public actionManager = new ActionManager();
//     public memory = new Memory();
//     public layerManager = new LayerManager(this);
//     public keyManager = new KeyManager(this);
//     // public clipboardManager = new ClipboardManager(this);

//     public horizontalGuides = React.createRef<Guides>();
//     public verticalGuides = React.createRef<Guides>();
//     public infiniteViewer = React.createRef<InfiniteViewer>();
//     public moveableManager = React.createRef<Moveable>();
//     public selecto = React.createRef<Selecto>();
//     public menu = React.createRef<Menu>();
//     public viewport = React.createRef<Viewport>();
//     public tabs = React.createRef<Tabs>();
//     public editorElement = React.createRef<StyledElement<HTMLDivElement>>();

//     declare context: React.ContextType<typeof StoreRootContext>;

//     public render() {
//         const {
//             horizontalGuides,
//             verticalGuides,
//             infiniteViewer,
//             moveableManager,
//             viewport,
//             menu,
//             tabs,
//             selecto,
//             state,
//         } = this;
//         const {
//             selectedMenu,
//             selectedTargets,
//             zoom,
//         } = state;
//         const {
//             width,
//             height,
//         } = this.props;
//         const horizontalSnapGuides = state.horizontalGuides;
//         const verticalSnapGuides = state.verticalGuides;

//         return (
//             <EditorElement className={prefix("editor")} ref={this.editorElement}>
//                 <Tabs ref={tabs}></Tabs>
//                 <Menu ref={menu} onSelect={this.onMenuChange} />
//                 <div className={prefix("reset")} onClick={e => {
//                     infiniteViewer.current!.scrollCenter();
//                 }}></div>
//                 <GuidesManager ref={horizontalGuidesRef} type="horizontal" />
//                 <GuidesManager ref={verticalGuidesRef} type="vertical" />
//                 <InfiniteViewer
//                     ref={infiniteViewer}
//                     className={prefix("viewer")}
//                     usePinch={true}
//                     useAutoZoom={true}
//                     useWheelScroll={true}
//                     useForceWheel={true}
//                     pinchThreshold={50}
//                     maxPinchWheel={3}
//                     onDragStart={e => {
//                         const target = e.inputEvent.target;
//                         this.checkBlur();

//                         if (
//                             target.nodeName === "A"
//                             || moveableManager.current!.isMoveableElement(target)
//                             || moveableManager.current!.isDragging()
//                             || selectedTargets.some(t => t === target || t.contains(target))
//                         ) {
//                             e.stop();
//                         }
//                     }}
//                     onDragEnd={e => {
//                         if (!e.isDrag) {
//                             selecto.current!.clickTarget(e.inputEvent);
//                         }
//                     }}
//                     onAbortPinch={e => {
//                         selecto.current!.triggerDragStart(e.inputEvent);
//                     }}
//                     onScroll={e => {
//                         horizontalGuides.current!.scroll(e.scrollLeft);
//                         horizontalGuides.current!.scrollGuides(e.scrollTop);

//                         verticalGuides.current!.scroll(e.scrollTop);
//                         verticalGuides.current!.scrollGuides(e.scrollLeft);
//                     }}
//                     onPinch={e => {
//                         if (moveableManager.current!.isDragging()) {
//                             return;
//                         }
//                         setZoom(e.zoom);
//                     }}
//                 >
//                     <Viewport ref={viewport}
//                         onBlur={this.onBlur}
//                         style={{
//                             width: `${width}px`,
//                             height: `${height}px`,
//                         }}>
//                         <MoveableManager
//                             ref={moveableManager}
//                             selectedTargets={selectedTargets}
//                             selectedMenu={selectedMenu}
//                             verticalGuidelines={verticalSnapGuides}
//                             horizontalGuidelines={horizontalSnapGuides}
//                             zoom={zoom}
//                         ></MoveableManager>
//                     </Viewport>
//                 </InfiniteViewer>
//                 <Selecto
//                     ref={selecto}
//                     getElementRect={getElementInfo}
//                     dragContainer={".scena-viewer"}
//                     hitRate={0}
//                     selectableTargets={[`.scena-viewport [${DATA_SCENA_ELEMENT_ID}]`]}
//                     selectByClick={true}
//                     selectFromInside={false}
//                     toggleContinueSelect={["shift"]}
//                     preventDefault={true}
//                     scrollOptions={{
//                         container: () => infiniteViewer.current!.getContainer(),
//                         threshold: 30,
//                         throttleTime: 30,
//                         getScrollPosition: () => {
//                             const current = infiniteViewer.current!;
//                             return [
//                                 current.getScrollLeft({ absolute: true }),
//                                 current.getScrollTop({ absolute: true }),
//                             ];
//                         },
//                     }}
//                     onDragStart={e => {
//                         const inputEvent = e.inputEvent;
//                         const target = inputEvent.target;

//                         this.checkBlur();
//                         if (selectedMenu === "Text" && target.isContentEditable) {
//                             const contentElement = getContentElement(target);

//                             if (contentElement && contentElement.hasAttribute(DATA_SCENA_ELEMENT_ID)) {
//                                 e.stop();
//                                 this.setSelectedTargets([contentElement]);
//                             }
//                         }
//                         if (
//                             (inputEvent.type === "touchstart" && e.isTrusted)
//                             || moveableManager.current!.isMoveableElement(target)
//                             || state.selectedTargets.some(t => t === target || t.contains(target))
//                         ) {
//                             e.stop();
//                         }
//                     }}
//                     onScroll={({ direction }) => {
//                         infiniteViewer.current!.scrollBy(direction[0] * 10, direction[1] * 10);
//                     }}
//                     onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
//                         if (isDragStart) {
//                             inputEvent.preventDefault();
//                         }
//                         if (this.selectEndMaker(rect)) {
//                             return;
//                         }
//                         this.setSelectedTargets(selected).then(() => {
//                             if (!isDragStart) {
//                                 return;
//                             }
//                             moveableManager.current!.dragStart(inputEvent);
//                         });
//                     }}
//                 ></Selecto>
//             </EditorElement>
//         );
//     }
//     public async componentDidMount() {
//         const {
//             infiniteViewer,
//             memory,
//             actionManager,
//             keyManager,
//         } = this;
//         memory.set("background-color", "#4af");
//         memory.set("color", "#333");

//         requestAnimationFrame(() => {
//             this.verticalGuides.current!.resize();
//             this.horizontalGuides.current!.resize();
//             infiniteViewer.current!.scrollCenter();
//         });
//         window.addEventListener("resize", this.onResize);
//         const viewport = this.getViewport();

//         actionManager.on("blur", () => {
//             const activeElement = document.activeElement;

//             if (activeElement) {
//                 (activeElement as HTMLElement).blur();
//             }
//             const selection = document.getSelection()!;

//             if (selection) {
//                 selection.removeAllRanges();
//             }
//             this.menu.current!.blur();
//             this.tabs.current!.blur();
//         });
//         actionManager.on("selectLayers", (e: any) => {
//             const selected = e.selected as string[];

//             this.setSelectedTargets(selected.map(key => viewport.getInfo(key)!.el!));
//         });
//         actionManager.on("update", () => {
//             this.forceUpdate();
//         });
//         actionManager.on("move.up", e => {
//             this.move(0, -10);
//             e.inputEvent?.preventDefault();
//         });
//         actionManager.on("move.left", e => {
//             this.move(-10, 0);
//             e.inputEvent?.preventDefault();
//         });
//         actionManager.on("move.right", e => {
//             this.move(10, 0);
//             e.inputEvent?.preventDefault();
//         });
//         actionManager.on("move.down", e => {
//             this.move(0, 10);
//             e.inputEvent?.preventDefault();
//         });
//         actionManager.on("remove.targets", () => {
//             this.removeElements(this.getSelectedTargets());
//         });


//         keyManager.actionDown(["left"], "move.left");
//         keyManager.actionDown(["right"], "move.right");
//         keyManager.actionDown(["up"], "move.up");
//         keyManager.actionDown(["down"], "move.down");
//         keyManager.actionUp(["delete"], "remove.targets");
//         keyManager.actionUp(["backspace"], "remove.targets");


//         const agent = await getAccurateAgent()!;
//         const isMacintosh = agent.os.name === "mac" || agent.os.name === "ios";
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "x"], () => { }, "Cut");
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "c"], () => { }, "Copy");
//         // this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "shift", "c"], e => {
//         //     this.clipboardManager.copyImage();
//         //     e.inputEvent.preventDefault();
//         // }, "Copy to Image");
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "v"], () => { }, "Paste");
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "z"], () => {
//             this.historyManager.undo();
//         }, "Undo");
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "shift", "z"], () => {
//             this.historyManager.redo();
//         }, "Redo");
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "a"], e => {
//             this.setSelectedTargets(this.getViewportInfos().map(info => info.el!));
//             e.inputEvent.preventDefault();
//         }, "Select All");
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "alt", "g"], e => {
//             e.inputEvent.preventDefault();
//             this.moveInside();
//         }, "Move Inside");
//         this.keyManager.keydown([isMacintosh ? "meta" : "ctrl", "shift", "alt", "g"], e => {
//             e.inputEvent.preventDefault();
//             this.moveOutside();
//         }, "Move Outside");
//         this.historyManager.registerType("createElements", undoCreateElements, restoreElements);
//         this.historyManager.registerType("removeElements", restoreElements, undoCreateElements);
//         this.historyManager.registerType("selectTargets", undoSelectTargets, redoSelectTargets);
//         this.historyManager.registerType("changeText", undoChangeText, redoChangeText);
//         this.historyManager.registerType("move", undoMove, redoMove);
//     }
//     public componentWillUnmount() {
//         this.actionManager.off();
//         this.memory.clear();
//         this.layerManager.clear();
//         this.keyManager.destroy();
//         // this.clipboardManager.destroy();
//         window.removeEventListener("resize", this.onResize);
//     }
//     public promiseState(state: Partial<ScenaEditorState>) {
//         return new Promise<void>(resolve => {
//             this.setState(state, () => {
//                 resolve();
//             });
//         });
//     }
//     public getSelecto = () => {
//         return this.selecto.current!;
//     }
//     public getViewport = () => {
//         return this.viewport.current!;
//     }
//     public getEditorElement = () => {
//         return this.editorElement.current!.getElement();
//     }
//     public getSelectedTargets = () => {
//         return this.state.selectedTargets;
//     }
//     public setSelectedTargets(targets: Array<HTMLElement | SVGElement>, isRestore?: boolean) {
//         targets = targets.filter(target => {
//             return targets.every(parnetTarget => {
//                 return parnetTarget === target || !parnetTarget.contains(target);
//             });
//         });

//         return this.promiseState({
//             selectedTargets: targets,
//         }).then(() => {
//             if (!isRestore) {
//                 const prevs = getIds(this.layerManager.getSelectedTargets());
//                 const nexts = getIds(targets);

//                 if (prevs.length !== nexts.length || !prevs.every((prev, i) => nexts[i] === prev)) {
//                     this.historyManager.addAction("selectTargets", { prevs, nexts });
//                 }
//             }
//             this.selecto.current!.setSelectedTargets(targets);
//             this.layerManager.setSelectedTargets(targets);
//             this.actionManager.trigger("setSelectedTargets");
//             return targets;
//         });
//     }
//     public appendJSX(info: ElementInfo) {
//         return this.appendJSXs([info]).then(targets => targets[0]);
//     }

//     public appendJSXs(jsxs: ElementInfo[], isRestore?: boolean): Promise<Array<HTMLElement | SVGElement>> {
//         const viewport = this.getViewport();
//         const indexesList = viewport.getSortedIndexesList(this.getSelectedTargets());
//         const indexesListLength = indexesList.length;
//         let appendIndex = -1;
//         let scopeId: string = "";

//         if (!isRestore && indexesListLength) {
//             const indexes = indexesList[indexesListLength - 1];


//             const info = viewport.getInfoByIndexes(indexes);

//             scopeId = info.scopeId!;
//             appendIndex = indexes[indexes.length - 1] + 1;
//         }

//         Debugger.log("append jsxs", jsxs, appendIndex, scopeId);

//         return this.getViewport().appendJSXs(jsxs, appendIndex, scopeId).then(({ added }) => {
//             return this.appendComplete(added, isRestore);
//         });
//     }

//     public removeByIds(ids: string[], isRestore?: boolean) {
//         return this.removeElements(this.getViewport().getElements(ids), isRestore);
//     }
//     public removeFrames(targets: Array<HTMLElement | SVGElement>) {
//         const frameMap: Record<string, {
//             frame: Record<string, any>;
//             frameOrder: Record<string, any>;
//         }> = {};
//         const layerManager = this.layerManager;
//         const viewport = this.getViewport();

//         targets.forEach(function removeFrame(target) {
//             const info = viewport.getInfoByElement(target)!;
//             const frame = layerManager.getFrame(target);
//             frameMap[info.id!] = {
//                 frame: frame.get(),
//                 frameOrder: frame.getOrderObject(),
//             };
//             layerManager.removeFrame(target);

//             info.children!.forEach(childInfo => {
//                 removeFrame(childInfo.el!);
//             });
//         });

//         return frameMap;
//     }
//     public restoreFrames(infos: MovedInfo[], frameMap: Record<string, FrameInfo>) {
//         const viewport = this.getViewport();
//         const layerManager = this.layerManager;

//         infos.map(({ info }) => info).forEach(function registerFrame(info: ElementInfo) {
//             info.frame = frameMap[info.id!].frame;
//             info.frameOrder = frameMap[info.id!].order;
//             delete frameMap[info.id!];

//             info.children!.forEach(registerFrame);
//         });

//         for (const id in frameMap) {
//             layerManager.createFrame(viewport.getInfo(id).el!, frameMap[id]);
//         }
//     }
//     public removeElements(targets: Array<HTMLElement | SVGElement>, isRestore?: boolean) {
//         const viewport = this.getViewport();
//         const frameMap = this.removeFrames(targets);
//         const indexesList = viewport.getSortedIndexesList(targets);
//         const indexesListLength = indexesList.length;
//         let scopeId = "";
//         let selectedInfo: ElementInfo | null = null;

//         if (indexesListLength) {
//             const lastInfo = viewport.getInfoByIndexes(indexesList[indexesListLength - 1]);
//             const nextInfo = viewport.getNextInfo(lastInfo.id!);

//             scopeId = lastInfo.scopeId!;
//             selectedInfo = nextInfo;
//         }
//         // return;
//         return viewport.removeTargets(targets).then(({ removed }) => {
//             let selectedTarget = selectedInfo || viewport.getLastChildInfo(scopeId)! || viewport.getInfo(scopeId);

//             this.setSelectedTargets(selectedTarget && selectedTarget.el ? [selectedTarget.el!] : [], true);

//             Debugger.log("removeTargets", removed);
//             !isRestore && this.historyManager.addAction("removeElements", {
//                 infos: removed.map(function removeTarget(info: ElementInfo): ElementInfo {
//                     return {
//                         ...info,
//                         children: info.children!.map(removeTarget),
//                         ...(frameMap[info.id!] || {}),
//                     };
//                 }),
//             });
//             return targets;
//         });
//     }
//     public setProperty(scope: string[], value: any, isUpdate?: boolean) {
//         const infos = this.layerManager.setProperty(scope, value);

//         this.historyManager.addAction("renders", { infos });

//         if (isUpdate) {
//             this.moveableManager.current!.updateRect();
//         }
//         this.actionManager.requestTrigger("render");
//     }
//     public setOrders(scope: string[], orders: NameType[], isUpdate?: boolean) {
//         const infos = this.layerManager.setOrders(scope, orders);

//         this.historyManager.addAction("renders", { infos });

//         if (isUpdate) {
//             this.moveableManager.current!.updateRect();
//         }
//         this.actionManager.requestTrigger("render");
//     }
//     public selectMenu = (menu: string) => {
//         this.menu.current!.select(menu);
//     }
//     public loadDatas(datas: SavedScenaData[]) {
//         const viewport = this.getViewport();
//         return this.appendJSXs(datas.map(function loadData(data): any {
//             const { componentId, jsxId, children } = data;

//             let jsx!: ScenaJSXElement;

//             if (jsxId) {
//                 jsx = viewport.getJSX(jsxId);
//             }
//             if (!jsx && componentId) {
//                 const Component = viewport.getComponent(componentId);

//                 jsx = <Component />;
//             }
//             if (!jsx) {
//                 jsx = React.createElement(data.tagName);
//             }
//             return {
//                 ...data,
//                 children: children.map(loadData),
//                 jsx,
//             };
//         }).filter(info => info) as ElementInfo[]);
//     }
//     public saveTargets(targets: Array<HTMLElement | SVGElement>): SavedScenaData[] {
//         const viewport = this.getViewport();
//         const layerManager = this.layerManager;
//         Debugger.log("save targets", targets);
//         return targets.map(target => viewport.getInfoByElement(target)).map(function saveTarget(info): SavedScenaData {
//             const target = info.el!;
//             const isContentEditable = info.attrs!.contenteditable;
//             return {
//                 name: info.name,
//                 attrs: getScenaAttrs(target),
//                 jsxId: info.jsxId || "",
//                 componentId: info.componentId!,
//                 innerHTML: isContentEditable ? "" : target.innerHTML,
//                 innerText: isContentEditable ? (target as HTMLElement).innerText : "",
//                 tagName: target.tagName.toLowerCase(),
//                 frame: layerManager.getFrame(target).get(),
//                 children: info.children!.map(saveTarget),
//             };
//         });
//     }
//     public getViewportInfos() {
//         return this.getViewport().getViewportInfos();
//     }
//     public appendBlob(blob: Blob) {
//         const url = URL.createObjectURL(blob);

//         return this.appendJSX({
//             jsx: <img src={url} alt="appended blob" />,
//             name: "(Image)",
//         });
//     }
//     public moves(movedInfos: MovedInfo[], isRestore?: boolean) {
//         const frameMap = this.removeFrames(movedInfos.map(({ info }) => info.el!));

//         return this.getViewport().moves(movedInfos).then(result => this.moveComplete(result, frameMap, isRestore));
//     }


//     private onMenuChange = (id: string) => {
//         this.setState({
//             selectedMenu: id,
//         });
//     }
//     private selectEndMaker(rect: Rect) {
//         const zoom = this.state.zoom;
//         const infiniteViewer = this.infiniteViewer.current!;
//         const selectIcon = this.menu.current!.getSelected();
//         const width = rect.width;
//         const height = rect.height;

//         if (!selectIcon || !selectIcon.maker || !width || !height) {
//             return false;
//         }
//         const maker = selectIcon.maker(this.memory);
//         const scrollTop = -infiniteViewer.getScrollTop() * zoom + 30;
//         const scrollLeft = -infiniteViewer.getScrollLeft() * zoom + 75;
//         const top = rect.top - scrollTop;
//         const left = rect.left - scrollLeft;

//         const style = {
//             top: `${top / zoom}px`,
//             left: `${left / zoom}px`,
//             position: "absolute",
//             width: `${width / zoom}px`,
//             height: `${height / zoom}px`,
//             ...maker.style,
//         } as any;
//         this.appendJSX({
//             jsx: maker.tag,
//             attrs: maker.attrs,
//             name: `(${selectIcon.id})`,
//             frame: style,
//         }).then(selectIcon.makeThen);
//         return true;
//     }
//     private move(deltaX: number, deltaY: number) {
//         this.moveableManager.current!.request("draggable", { deltaX, deltaY }, true);
//     }
//     private checkBlur() {
//         this.actionManager.trigger("blur");
//     }
//     private onResize = () => {
//         this.horizontalGuides.current!.resize();
//         this.verticalGuides.current!.resize();
//     }
//     private onBlur = (e: any) => {
//         const target = e.target as HTMLElement | SVGElement;

//         if (!checkInput(target)) {
//             return;
//         }
//         const parentTarget = getParnetScenaElement(target);

//         if (!parentTarget) {
//             return;
//         }
//         const info = this.getViewport().getInfoByElement(parentTarget)!;


//         if (!info.attrs!.contenteditable) {
//             return
//         }
//         const nextText = (parentTarget as HTMLElement).innerText;

//         if (info.innerText === nextText) {
//             return;
//         }
//         this.historyManager.addAction("changeText", {
//             id: info.id,
//             prev: info.innerText,
//             next: nextText,
//         });
//         info.innerText = nextText;
//     }
//     private moveInside() {
//         let targets = this.getSelectedTargets();

//         const length = targets.length;
//         if (length !== 1) {
//             return;
//         }
//         targets = [targets[0]];


//         const viewport = this.getViewport();
//         const frameMap = this.removeFrames(targets);

//         return viewport.moveInside(targets[0]).then(result => this.moveComplete(result, frameMap));
//     }
//     private moveOutside() {
//         let targets = this.getSelectedTargets();

//         const length = targets.length;
//         if (length !== 1) {
//             return;
//         }
//         targets = [targets[0]];

//         const frameMap = this.removeFrames(targets);
//         this.getViewport().moveOutside(targets[0]).then(result => this.moveComplete(result, frameMap));

//     }
//     private appendComplete(infos: ElementInfo[], isRestore?: boolean) {
//         !isRestore && this.historyManager.addAction("createElements", {
//             infos,
//             prevSelected: getIds(this.getSelectedTargets()),
//         });
//         const data = this.layerManager;
//         const container = this.getViewport().viewportRef.current!;
//         const targets = infos.map(function registerFrame(info) {
//             const frame = data.createFrame(info.el!, info.frame);

//             if (info.frameOrder) {
//                 frame.setOrderObject(info.frameOrder);
//             }
//             data.render(info.el!);

//             info.children!.forEach(registerFrame);
//             return info.el!;
//         }).filter(el => el);
//         infos.forEach(info => {
//             if (!info.moveMatrix) {
//                 return;
//             }
//             const frame = data.getFrame(info.el!);
//             let nextMatrix = getOffsetOriginMatrix(info.el!, container);

//             nextMatrix = invert(nextMatrix, 4);

//             const moveMatrix = matrix3d(nextMatrix, info.moveMatrix);

//             setMoveMatrix(frame, moveMatrix);
//             data.render(info.el!);
//         });
//         return Promise.all(targets.map(target => checkImageLoaded(target))).then(() => {
//             this.setSelectedTargets(targets, true);

//             return targets;
//         });
//     }
//     private moveComplete(result: MovedResult, frameMap: Record<string, any>, isRestore?: boolean) {
//         Debugger.log("Move", result);

//         const { prevInfos, nextInfos } = result;

//         this.restoreFrames(nextInfos, frameMap);

//         if (nextInfos.length) {
//             if (!isRestore) {
//                 this.historyManager.addAction("move", {
//                     prevInfos,
//                     nextInfos,
//                 });
//             }
//             // move complete
//             this.appendComplete(nextInfos.map(({ info, moveMatrix }) => {
//                 return {
//                     ...info,
//                     moveMatrix,
//                 };
//             }), true);
//         }

//         return result;
//     }
// }
