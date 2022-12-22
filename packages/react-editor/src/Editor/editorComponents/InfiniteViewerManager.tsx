import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import { useStoreStateSetValue, useStoreStateValue, useStoreValue } from "@scena/react-store";
import { $space } from "../stores/keys";
import {
    $actionManager, $horizontalGuides, $layerManager, $moveable,
    $selectedLayers, $selecto, $verticalGuides, $zoom,
} from "../stores/stores";
import { prefix } from "../utils/utils";

export interface InfiniteViewerManagerProps {
    children: React.ReactNode;
}
export const InfiniteViewerManager = React.forwardRef<InfiniteViewer, InfiniteViewerManagerProps>((props, ref) => {
    const selectoRef = useStoreStateValue($selecto);
    const moveableRef = useStoreStateValue($moveable);
    const horizontalGuidesRef = useStoreStateValue($horizontalGuides);
    const verticalGuidesRef = useStoreStateValue($verticalGuides);
    const actionManager = useStoreStateValue($actionManager);
    const layerManager = useStoreStateValue($layerManager);
    const selectedLayersStore = useStoreValue($selectedLayers);

    const isSpace = useStoreStateValue($space);
    const setZoom = useStoreStateSetValue($zoom);

    return <InfiniteViewer
        ref={ref}
        className={prefix("viewer", isSpace ? "viewer-move" : "")}
        usePinch={true}
        useAutoZoom={true}
        useWheelScroll={true}
        useForceWheel={true}
        useMouseDrag={isSpace}
        pinchThreshold={50}
        maxPinchWheel={3}
        onDragStart={e => {
            const target = e.inputEvent.target;
            const flatted = layerManager.toFlattenElement(selectedLayersStore.value);

            actionManager.act("blur");

            if (
                target.nodeName === "A"
                || moveableRef.current!.isMoveableElement(target)
                || moveableRef.current!.isDragging()
                || flatted.some(t => t === target || t.contains(target))
            ) {
                e.stop();
            }
        }}
        onDragEnd={e => {
            if (!e.isDrag) {
                selectoRef.current!.clickTarget(e.inputEvent);
            }
        }}
        onAbortPinch={e => {
            selectoRef.current!.triggerDragStart(e.inputEvent);
        }}
        onScroll={e => {
            const horizontalGuides = horizontalGuidesRef.current!;
            const verticalGuides = verticalGuidesRef.current!;

            horizontalGuides.scroll(e.scrollLeft);
            horizontalGuides.scrollGuides(e.scrollTop);

            verticalGuides.scroll(e.scrollTop);
            verticalGuides.scrollGuides(e.scrollLeft);
        }}
        onPinch={e => {
            if (moveableRef.current!.isDragging()) {
                return;
            }
            setZoom(e.zoom);
        }}
    >{props.children}</InfiniteViewer>;
});

InfiniteViewerManager.displayName = "InfiniteViewerManager";


