import * as React from "react";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { Text } from "./inputs/Text";
import { useStoreStateValue } from "@scena/react-store";
import {
    $layerManager,
    $selectedFlattenLayers,
} from "../../stores/stores";
import { Frame } from "scenejs";
import { useAction } from "../../hooks/useAction";

const AppearanceTabElement = styled("div", `
{
    color: var(--scena-editor-color-text);
    font-size: 12px;
    padding: 0px 5px;
    display: flex;
    align-content: center;
    align-items: stretch;
}

.scena-tab-grid {
    flex: auto;
}
.scena-tab-grid-radius-icon {
    padding: 10px;
    margin-right: 10px;

}
.scena-tab-grid-radius.scena-tab-disabled {
    opacity: 0.3;
}
.scena-tab-radius-icon {
    width: 10px;
    height: 10px;
    border-radius: 80% 0 0 0;
    border-left: 1px solid var(--scena-editor-color-text);
    border-top: 1px solid var(--scena-editor-color-text);
}
`);


export default function BorderTab() {
    useAction("render.end");

    const layerManager = useStoreStateValue($layerManager);
    const selectedLayers = useStoreStateValue($selectedFlattenLayers);

    const selected = selectedLayers.map(layer => {
        const frame = layerManager.getFrame(layer);

        return frame;
    }).filter(Boolean) as Frame[];

    let radius = "";

    selected.some(frame => {
        const selectedRadius = frame.get("border-radius");

        if (selectedRadius) {
            radius = selectedRadius;
        }
        return selectedRadius;
    });

    const radiusValues = radius ? radius.split(" ") : [];
    const length = radiusValues.length || 1;
    const [
        leftTop = "0",
        rightTop = leftTop,
        rightBottom = leftTop,
        leftBottom = rightTop,
    ] = radiusValues;

    return <AppearanceTabElement>
        <div className={prefix("tab-grid", "tab-grid-radius-icon")}>
            <div className={prefix("tab-radius-icon")}></div>
        </div>
        <div className={prefix("tab-grid", "tab-grid-radius", length < 1 ? "tab-disabled" : "")}>
            <Text defaultValue={leftTop} />
        </div>
        <div className={prefix("tab-grid", "tab-grid-radius", length < 2 ? "tab-disabled" : "")}>
            <Text defaultValue={rightTop} />
        </div>
        <div className={prefix("tab-grid", "tab-grid-radius", length < 3 ? "tab-disabled" : "")}>
            <Text defaultValue={rightBottom} />
        </div>
        <div className={prefix("tab-grid", "tab-grid-radius", length < 4 ? "tab-disabled" : "")}>
            <Text defaultValue={leftBottom} />
        </div>
    </AppearanceTabElement>;
}
