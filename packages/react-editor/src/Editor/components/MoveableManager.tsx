/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import Moveable, { ElementGuidelineValueOption, MoveableRefType } from "react-moveable";
import { getContentElement, getId } from "../utils/utils";
import { IObject, isObject } from "@daybrush/utils";
import { DimensionViewable } from "./ables/DimensionViewable";
import { DeleteButtonViewable } from "./ables/DeleteButtonViewable";
import { useStoreState, useStoreStateValue } from "../Store/Store";
import {
    $actionManager, $layerManager, $editor, $groupManager,
    $historyManager, $horizontalGuidelines, $infiniteViewer,
    $layers, $memoryManager, $selectedMenu, $selectedTargets,
    $selecto, $verticalGuidelines, $zoom,
} from "../stores/stores";
import { EditorManagerInstance } from "../EditorManager";
import { $shift } from "../stores/keys";

function restoreRender(
    id: string,
    state: IObject<any>,
    prevState: IObject<any>,
    orders: any,
    editor: EditorManagerInstance,
) {
    // const el = editor.viewportRef.current!.getElement(id);

    // if (!el) {
    //     console.error("No Element");
    //     return false;
    // }
    // const dataManager = editor.dataManager;
    // const frame = dataManager.getFrame(el);;

    // frame.clear();
    // frame.set(state);
    // frame.setOrderObject(orders);

    // const result = diff(Object.keys(prevState), Object.keys(state));
    // const { removed, prevList } = result;

    // removed.forEach(index => {
    //     el.style.removeProperty(prevList[index]);
    // });
    // dataManager.render(el);
    return true;
}
function undoRender({ id, prev, next, prevOrders }: IObject<any>, editor: EditorManagerInstance) {
    if (!restoreRender(id, prev, next, prevOrders, editor)) {
        return;
    }
    editor.moveableRef.current!.updateRect();
    editor.actionManager.trigger("render");
}
function redoRender({ id, prev, next, nextOrders }: IObject<any>, editor: EditorManagerInstance) {
    if (!restoreRender(id, next, prev, nextOrders, editor)) {
        return;
    }
    editor.moveableRef.current!.updateRect();
    editor.actionManager.trigger("render");
}

function undoRenders({ infos }: IObject<any>, editor: EditorManagerInstance) {
    infos.forEach(({ id, prev, next, prevOrders }: IObject<any>) => {
        restoreRender(id, prev, next, prevOrders, editor);
    });
    editor.moveableRef.current!.updateRect();
    editor.actionManager.trigger("render");
}

function redoRenders({ infos }: IObject<any>, editor: EditorManagerInstance) {
    infos.forEach(({ id, next, prev, nextOrders }: IObject<any>) => {
        restoreRender(id, next, prev, nextOrders, editor);
    });
    editor.moveableRef.current!.updateRect();
    editor.actionManager.trigger("render");
}

export interface ScenaMoveableMangerProps { }

export const MoveableManager = React.forwardRef<Moveable, ScenaMoveableMangerProps>((props, ref) => {
    const isShift = useStoreStateValue($shift);
    const [selectedMenu, setSelectedMenu] = useStoreState($selectedMenu);

    const verticalGuidelines = useStoreStateValue($verticalGuidelines);
    const horizontalGuidelines = useStoreStateValue($horizontalGuidelines);
    const zoom = useStoreStateValue($zoom);

    const layers = useStoreStateValue($layers);
    const selectedTargets = useStoreStateValue($selectedTargets);

    const infiniteViewerRef = useStoreStateValue($infiniteViewer);
    const selectoRef = useStoreStateValue($selecto);
    const editorRef = useStoreStateValue($editor);

    const groupManager = useStoreStateValue($groupManager);
    const actionManager = useStoreStateValue($actionManager);
    const historyManager = useStoreStateValue($historyManager);
    const layerManager = useStoreStateValue($layerManager);
    const memoryManager = useStoreStateValue($memoryManager);


    const elementGuidelines: Array<ElementGuidelineValueOption | MoveableRefType<Element>> = [
        ".scena-viewport",
        ...layers.map(layer => layer.ref),
    ].filter(el => {
        if (isObject(el) && el.current) {
            return selectedTargets.indexOf(el.current) === -1;
        }
        return true;
    });

    React.useEffect(() => {
        historyManager.registerType("render", undoRender, redoRender);
        historyManager.registerType("renders", undoRenders, redoRenders);
    }, [historyManager]);

    return <Moveable
        ables={[DimensionViewable, DeleteButtonViewable]}
        ref={ref}
        target={selectedTargets}
        props={{
            dimensionViewable: true,
            deleteButtonViewable: false,
        }}
        draggable={true}
        resizable={true}
        pinchable={["rotatable"]}
        zoom={1 / zoom}
        throttleResize={1}
        clippable={selectedMenu === "Crop"}
        passDragArea={selectedMenu === "Text"}
        checkInput={selectedMenu === "Text"}
        throttleDragRotate={isShift ? 45 : 0}
        keepRatio={isShift}
        groupableProps={{
            keepRatio: true,
        }}
        rotatable={true}
        snappable={true}
        snapDirections={{ top: true, left: true, right: true, center: true, middle: true, bottom: true }}
        elementSnapDirections={{ top: true, left: true, right: true, center: true, middle: true, bottom: true }}
        snapGap={false}
        isDisplayInnerSnapDigit={true}
        roundable={false}
        isDisplayShadowRoundControls={true}
        roundPadding={10}
        roundClickable={true}
        verticalGuidelines={verticalGuidelines}
        horizontalGuidelines={horizontalGuidelines}
        elementGuidelines={elementGuidelines as any}
        clipArea={true}
        clipVerticalGuidelines={[0, "50%", "100%"]}
        clipHorizontalGuidelines={[0, "50%", "100%"]}
        clipTargetBounds={true}
        defaultClipPath={memoryManager.get("crop") || "inset"}

        scrollContainer={() => infiniteViewerRef.current!.getContainer()}
        scrollThreshold={30}
        scrollThrottleTime={30}
        getScrollPosition={() => {
            const current = infiniteViewerRef.current!;

            return [
                current.getScrollLeft({ absolute: true }),
                current.getScrollTop({ absolute: true }),
            ];
        }}
        onClick={e => {
            const target = e.inputTarget as any;

            if (e.isDouble && target.isContentEditable) {
                setSelectedMenu("Text");
                const el = getContentElement(target);

                if (el) {
                    el.focus();
                }
            } else {
                selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
            }
        }}
        onClickGroup={e => {
            if (!e.moveableTarget) {
                editorRef.current!.setSelectedTargets([]);
                return;
            }
            if (e.isDouble) {
                const nextTargets = groupManager.selectNextChild(selectedTargets, e.moveableTarget);
                editorRef.current!.setSelectedTargets(nextTargets);
                return;
            }
            selectoRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
        }}
        onRenderStart={e => {
            e.datas.prevData = layerManager.getCSSByElement(e.target);
        }}
        onRender={e => {
            e.datas.isRender = true;
            e.target.style.cssText += e.cssText;
            actionManager.requestTrigger("render");
            layerManager.setCSSByElement(e.target, e.cssText);
        }}
        onRenderEnd={e => {
            actionManager.requestTrigger("render");

            if (!e.datas.isRender) {
                return;
            }
            const layer = layerManager.getLayerByElement(e.target);

            if (!layer) {
                return;
            }

            historyManager.addHistory("render", {
                layer,
                prev: e.datas.prevData,
                next: layerManager.getFrame(layer).get(),
            });
        }}
        onRenderGroupStart={e => {
            e.datas.prevDatas = e.targets.map(target => layerManager.getCSSByElement(target));
        }}
        onRenderGroup={e => {
            e.datas.isRender = true;

            e.events.forEach(ev => {
                ev.target.style.cssText += ev.cssText;
                layerManager.setCSSByElement(ev.target, ev.cssText);
            });
            actionManager.requestTrigger("renderGroup", e);
        }}
        onRenderGroupEnd={e => {
            actionManager.requestTrigger("renderGroup", e);

            if (!e.datas.isRender) {
                return;
            }
            const prevDatas = e.datas.prevDatas;
            const infos = e.targets.map((target, i) => {
                const layer = layerManager.getLayerByElement(target)!;

                return {
                    layer,
                    prev: prevDatas[i],
                    next: layerManager.getFrame(layer).get(),
                };
            });

            historyManager.addHistory("renders", {
                infos,
            });
        }}
    ></Moveable>;
});


MoveableManager.displayName = "MoveableManager";
