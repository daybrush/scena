import Guides from "@scena/react-guides";
import * as React from "react";
import { useStoreState, useStoreStateValue, useStoreValue } from "@scena/react-store";
import { $darkMode, $horizontalGuidelines, $scrollPos, $verticalGuidelines, $zoom } from "../stores/stores";
import { useAction } from "../hooks/useAction";
import { RectInfo } from "react-moveable";
import { throttle } from "@daybrush/utils";


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
    const darkMode = useStoreStateValue($darkMode);
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

    const scrollPos = useStoreValue($scrollPos).value;
    let defaultScrollPos = 0;
    let defaultGuidesPos = 0;

    if (isHorizontal) {
        [defaultScrollPos, defaultGuidesPos] = scrollPos;
    } else {
        [defaultGuidesPos, defaultScrollPos] = scrollPos;
    }
    return <Guides
        ref={ref}
        type={type}
        snapThreshold={5}
        snaps={[0, ...guidelines]}
        displayDragPos={true}
        textFormat={v => `${throttle(v, 0.1)}`}
        dragPosFormat={dragPosFormat}
        zoom={zoom}
        unit={unit}

        // --scena-editor-color-text
        textColor={darkMode ? "#fff" : "#555"}
        // --scena-editor-color-guides
        backgroundColor={darkMode ? "#333" : "#eee"}
        lineColor={darkMode ? "#777" : "#ccc"}
        selectedBackgroundColor={"#55bbff33"}
        useResizeObserver={true}
        selectedRangesText={true}
        selectedRanges={selectedRanges}
        defaultGuidesPos={defaultGuidesPos}
        defaultScrollPos={defaultScrollPos}
        defaultGuides={guidelines}
        onChangeGuides={React.useCallback(e => {
            setGuidelines(e.guides);
        }, [])}
    ></Guides>;
});


GuidesManager.displayName = "GuidesManager";
