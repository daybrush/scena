import Guides from "@scena/react-guides";
import * as React from "react";
import { useStoreState, useStoreStateValue } from "@scena/react-store";
import { $horizontalGuidelines, $verticalGuidelines, $zoom } from "../stores/stores";


function dragPosFormat(value: number) {
    return `${value}px`;
}
export interface GuidesManagerProps {
    type: "horizontal" | "vertical"
}

export const GuidesManager = React.forwardRef<Guides, GuidesManagerProps>((props, ref) => {
    const type = props.type;
    const [guidelines, setGuidelines] = useStoreState(
        type === "horizontal"
            ? $horizontalGuidelines
            : $verticalGuidelines
    );
    const zoom = useStoreStateValue($zoom);
    let unit = 50;

    if (zoom < 0.8) {
        unit = Math.floor(1 / zoom) * 50;
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
        onChangeGuides={React.useCallback(e => {
            setGuidelines(e.guides);
        }, [])}
    ></Guides>;
});


GuidesManager.displayName = "GuidesManager";
