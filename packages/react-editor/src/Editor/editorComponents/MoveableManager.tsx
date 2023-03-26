/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import Moveable, { ElementGuidelineValueOption, MoveableRefType, SnapDirections } from "react-moveable";
import { getContentElement, getId } from "../utils/utils";
import { DimensionViewable } from "./ables/DimensionViewable";
import { DeleteButtonViewable } from "./ables/DeleteButtonViewable";
import { useStoreState, useStoreStateValue, useStoreValue } from "@scena/react-store";
import {
    $actionManager, $layerManager, $editor,
    $historyManager, $horizontalGuidelines, $infiniteViewer,
    $layers, $memoryManager, $selectedTool, $selectedLayers,
    $selecto, $verticalGuidelines, $zoom, $pointer, $groupOrigin,
} from "../stores/stores";
import { EditorManagerInstance } from "../EditorManager";
import { $alt, $meta, $shift } from "../stores/keys";

const SNAP_DIRECTIONS: SnapDirections = {
    top: true, left: true,
    right: true, center: true,
    middle: true, bottom: true,
};

export interface ScenaMoveableMangerProps { }

export const MoveableManager = React.forwardRef<Moveable, ScenaMoveableMangerProps>((props, ref) => {
    const isShift = useStoreStateValue($shift);
    // const isMeta = useStoreStateValue($meta);
    const altStore = useStoreValue($alt);


    const [selectedTool, setSelectedTool] = useStoreState($selectedTool);
    const pointer = useStoreStateValue($pointer);

    const verticalGuidelines = useStoreStateValue($verticalGuidelines);
    const horizontalGuidelines = useStoreStateValue($horizontalGuidelines);
    const zoom = useStoreStateValue($zoom);
    const groupOrigin = useStoreStateValue($groupOrigin);

    const layers = useStoreStateValue($layers);
    const selectedLayers = useStoreStateValue($selectedLayers);

    const infiniteViewerRef = useStoreStateValue($infiniteViewer);
    const selectoRef = useStoreStateValue($selecto);
    const editorRef = useStoreStateValue($editor);

    const actionManager = useStoreStateValue($actionManager);
    const historyManager = useStoreStateValue($historyManager);
    const layerManager = useStoreStateValue($layerManager);
    const memoryManager = useStoreStateValue($memoryManager);



    const targetList = layerManager.toTargetList(selectedLayers);
    const selectedTargets = targetList.displayed();
    const visibleLayers = layerManager.filterDisplayedLayers(layers);
    const flattenSelectedLayers = layerManager.toFlatten(selectedLayers);
    const elementGuidelines: Array<ElementGuidelineValueOption | MoveableRefType<Element>> = [
        ".scena-viewport",
        ...visibleLayers.filter(layer => !flattenSelectedLayers.includes(layer)).map(layer => layer.ref),
    ];

    return <Moveable
        ables={[DimensionViewable, DeleteButtonViewable]}
        ref={ref}
        target={selectedTargets}
        props={{
            dimensionViewable: true,
            deleteButtonViewable: false,
        }}
        draggable={true}
        useAccuratePosition={true}
        useResizeObserver={true}
        useMutationObserver={true}
        rotateAroundControls={true}
        pinchable={["rotatable"]}
        zoom={1 / zoom}
        edge={true}
        throttleResize={1}
        clippable={selectedTool === "crop"}
        passDragArea={selectedTool === "text"}
        checkInput={selectedTool === "text"}
        throttleDragRotate={isShift ? 45 : 0}
        throttleRotate={isShift ? 15 : 0}
        keepRatio={isShift}
        resizable={pointer === "move"}
        scalable={pointer === "scale"}
        rotatable={true}
        defaultGroupOrigin={groupOrigin}
        groupableProps={{
            keepRatio: true,
            clippable: false,
        }}
        snappable={true}
        snapDirections={SNAP_DIRECTIONS}
        elementSnapDirections={SNAP_DIRECTIONS}
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
        onChangeTargets={() => {
            actionManager.act("changed.targets");
        }}
        onBeforeResize={(e) => {
            e.setFixedDirection(altStore.value ? [0, 0] : e.startFixedDirection);
        }}
        onClick={e => {
            const target = e.inputTarget as any;

            if (e.isDouble && target.isContentEditable) {
                setSelectedTool("text");
                const el = getContentElement(target);

                if (el) {
                    el.focus();
                }
            } else if (e.isTrusted) {
                selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
            }
        }}
        onClickGroup={e => {
            if (!e.moveableTarget) {
                editorRef.current!.setSelectedLayers([]);
                return;
            }
            if (e.isDouble) {
                const nextChilds = layerManager.selectSubChilds(selectedTargets, e.moveableTarget);

                editorRef.current!.setSelectedLayers(layerManager.toLayerGroups(nextChilds));
                return;
            } else if (e.isTrusted) {
                selectoRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
            }
        }}
        onRenderStart={e => {
            e.datas.prevData = layerManager.getCSSByElement(e.target);
        }}
        onRender={e => {
            e.datas.isRender = true;
            e.target.style.cssText += e.cssText;
            // actionManager.requestTrigger("render.ing");
            layerManager.setCSSByElement(e.target, e.cssText);
        }}
        onRenderEnd={e => {
            if (!e.datas.isRender) {
                return;
            }
            actionManager.requestAct("render.end");

            const layer = layerManager.getLayerByElement(e.target);

            if (!layer) {
                return;
            }

            historyManager.addHistory("render", {
                infos: [
                    {
                        layer,
                        prev: e.datas.prevData,
                        next: layerManager.getFrame(layer).toCSSObject(),
                    },
                ],
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
            // actionManager.requestTrigger("render.group.ing", e);
        }}
        onRenderGroupEnd={e => {
            if (!e.datas.isRender) {
                return;
            }
            actionManager.requestAct("render.end");
            const prevDatas = e.datas.prevDatas;
            const infos = e.targets.map((target, i) => {
                const layer = layerManager.getLayerByElement(target)!;

                return {
                    layer,
                    prev: prevDatas[i],
                    next: layerManager.getFrame(layer).toCSSObject(),
                };
            });

            historyManager.addHistory("render", {
                infos,
            });
        }}
    ></Moveable>;
});


MoveableManager.displayName = "MoveableManager";
