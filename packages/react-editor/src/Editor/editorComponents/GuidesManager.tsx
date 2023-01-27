import Guides from "@scena/react-guides";
import * as React from "react";
import { useStoreState, useStoreStateValue } from "@scena/react-store";
import { $horizontalGuidelines, $verticalGuidelines, $zoom } from "../stores/stores";
import { useAction } from "../hooks/useAction";
import { RectInfo } from "react-moveable";


function dragPosFormat(value: number) {
    return `${value}px`;
}
export interface GuidesManagerProps {
    type: "horizontal" | "vertical"
}

export const GuidesManager = React.forwardRef<Guides, GuidesManagerProps>((props, ref) => {
    const type = props.type;
    const isHorizontal = type === "horizontal";
    const [guidelines, setGuidelines] = useStoreState(
        isHorizontal ? $horizontalGuidelines : $verticalGuidelines,
    );
    const zoom = useStoreStateValue($zoom);

    const result = useAction("get.rect");
    const rect = result?.rect as RectInfo;
    let unit = 50;

    if (zoom < 0.8) {
        unit = Math.floor(1 / zoom) * 50;
    }

    let selectedRanges!: number[][];

    if (rect && rect.width && rect.height) {
        selectedRanges = [
            isHorizontal
                ? [rect.left, rect.left + rect.width]
                : [rect.top, rect.top + rect.height],
        ];
    } else {
        selectedRanges = [
            isHorizontal
                ? [0, 600]
                : [0, 800],
        ];
    }
    return <Guides
        ref={ref}
        type={type}
        snapThreshold={5}
        snaps={[0, ...guidelines]}
        displayDragPos={true}
        dragPosFormat={dragPosFormat}
        zoom={zoom}
        unit={unit}
        selectedRanges={selectedRanges}
        onChangeGuides={React.useCallback(e => {
            setGuidelines(e.guides);
        }, [])}
    ></Guides>;
});


GuidesManager.displayName = "GuidesManager";
