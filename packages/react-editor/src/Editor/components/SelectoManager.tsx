import * as React from "react";
import { getElementInfo } from "react-moveable";
import Selecto from "react-selecto";
import { TargetList } from "../GroupManager";
import { useStoreStateValue, useStoreValue } from "../Store/Store";
import { $meta, $shift, $space } from "../stores/keys";
import {
    $actionManager, $editor, $infiniteViewer,
    $layerManager, $layers, $moveable, $selectedTool, $selectedTargetList,
} from "../stores/stores";

export interface SelectoManagerProps {

}

export const SelectoManager = React.forwardRef<Selecto, SelectoManagerProps>((props, ref) => {
    const spaceStore = useStoreValue($space);
    const metaStore = useStoreValue($meta);
    const shiftStore = useStoreValue($shift);

    const layers = useStoreStateValue($layers);
    const selectedTargetListStore = useStoreValue($selectedTargetList);


    const selectedTool = useStoreStateValue($selectedTool);
    const actionManager = useStoreStateValue($actionManager);
    const layerManager = useStoreStateValue($layerManager);

    const editorRef = useStoreStateValue($editor);
    const moveableRef = useStoreStateValue($moveable);
    const infiniteViewerRef = useStoreStateValue($infiniteViewer);

    return <Selecto
        ref={ref}
        getElementRect={getElementInfo}
        dragContainer={".scena-viewer"}
        hitRate={0}
        selectableTargets={layers.map(layer => layer.ref)}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={["shift"]}
        preventDefault={true}
        scrollOptions={{
            container: () => infiniteViewerRef.current!.getContainer(),
            threshold: 30,
            throttleTime: 30,
            getScrollPosition: () => {
                const current = infiniteViewerRef.current!;
                return [
                    current.getScrollLeft({ absolute: true }),
                    current.getScrollTop({ absolute: true }),
                ];
            },
        }}
        onDragStart={e => {
            if (spaceStore.value) {
                e.stop();
                return;
            }
            const inputEvent = e.inputEvent;
            const target = inputEvent.target;

            // check blur
            actionManager.emit("blur");

            const flatted = selectedTargetListStore.value?.flatten() ?? [];

            // if (selectedTool === "Text" && target.isContentEditable) {
            //     const contentElement = getContentElement(target);

            //     if (contentElement && contentElement.hasAttribute(DATA_SCENA_ELEMENT_ID)) {
            //         e.stop();
            //         editorRef.current!.setSelectedTargets([contentElement]);
            //     }
            // }

            if (
                (inputEvent.type === "touchstart" && e.isTrusted)
                || moveableRef.current!.isMoveableElement(target)
                || flatted.some(t => t === target || t.contains(target))
            ) {
                e.stop();
            }
        }}
        onScroll={({ direction }) => {
            infiniteViewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
        }}
        onSelectEnd={({
            isDragStart,
            isClick,
            added,
            removed,
            inputEvent,
        }) => {
            const moveable = moveableRef.current!;
            const targetList = selectedTargetListStore.value;

            if (isDragStart) {
                inputEvent.preventDefault();

                moveable.waitToChangeTarget().then(() => {
                    moveable.dragStart(inputEvent);
                });
            }
            const targets = targetList?.targets() ?? [];
            let nextTargetList!: TargetList;

            if (isDragStart || isClick) {
                if (metaStore.value) {
                    nextTargetList = layerManager.selectSingleChilds(targets, added, removed);
                } else {
                    nextTargetList = layerManager.selectCompletedChilds(targets, added, removed, shiftStore.value);
                }
            } else {
                nextTargetList = layerManager.selectSameDepthChilds(targets, added, removed);
            }
            editorRef.current!.setSelectedTargetList(nextTargetList);
        }}
    />;
});


SelectoManager.displayName = "SelectoManager";
